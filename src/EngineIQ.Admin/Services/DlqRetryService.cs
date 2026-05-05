using System.Text;
using EngineIQ.Infrastructure;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace EngineIQ.Admin.Services;

/// <summary>Serializes DLQ peek/retry under a lock (internal tooling; low concurrency).</summary>
public sealed class DlqRetryService
{
    private readonly IOptions<RabbitMqOptions> _options;
    private readonly ILogger<DlqRetryService> _logger;
    private readonly object _gate = new();

    public DlqRetryService(IOptions<RabbitMqOptions> options, ILogger<DlqRetryService> logger)
    {
        _options = options;
        _logger = logger;
    }

    public IReadOnlyList<string> PeekDlqJsonPreviews(int max = 100)
    {
        lock (_gate)
        {
            var opts = _options.Value;
            var factory = new ConnectionFactory
            {
                Uri = new Uri(opts.ConnectionString),
                DispatchConsumersAsync = true
            };
            using var conn = factory.CreateConnection("EngineIQ.Admin.Peek");
            using var ch = conn.CreateModel();
            DeclareQueues(ch, opts);

            var list = new List<string>();
            while (list.Count < max)
            {
                var r = ch.BasicGet(opts.DeadLetterQueueName, autoAck: false);
                if (r is null)
                    break;
                var text = Encoding.UTF8.GetString(r.Body.Span);
                list.Add(text.Length > 500 ? string.Concat(text.AsSpan(0, 500), "…") : text);
                ch.BasicNack(r.DeliveryTag, multiple: false, requeue: true);
            }

            return list;
        }
    }

    /// <summary>Drains DLQ, publishes one message to the main queue, returns others to DLQ.</summary>
    public int RetryMessageAtIndex(int index)
    {
        lock (_gate)
        {
            var opts = _options.Value;
            var factory = new ConnectionFactory
            {
                Uri = new Uri(opts.ConnectionString),
                DispatchConsumersAsync = true
            };
            using var conn = factory.CreateConnection("EngineIQ.Admin.DlqRetry");
            using var ch = conn.CreateModel();
            DeclareQueues(ch, opts);

            var bodies = new List<byte[]>();
            while (true)
            {
                var r = ch.BasicGet(opts.DeadLetterQueueName, autoAck: false);
                if (r is null)
                    break;
                bodies.Add(r.Body.ToArray());
                ch.BasicAck(r.DeliveryTag, multiple: false);
            }

            if (bodies.Count == 0)
                return 0;

            if (index < 0 || index >= bodies.Count)
            {
                foreach (var b in bodies)
                    Republish(ch, opts.DeadLetterQueueName, b);
                throw new ArgumentOutOfRangeException(nameof(index), "DLQ index out of range after drain.");
            }

            for (var i = 0; i < bodies.Count; i++)
            {
                var target = i == index ? opts.QueueName : opts.DeadLetterQueueName;
                Republish(ch, target, bodies[i]);
            }

            _logger.LogInformation(
                "DLQ retry: published index {Index} to main queue ({Count} messages drained).",
                index,
                bodies.Count);
            return bodies.Count;
        }
    }

    private static void DeclareQueues(IModel ch, RabbitMqOptions opts)
    {
        ch.QueueDeclare(opts.QueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
        ch.QueueDeclare(opts.DeadLetterQueueName, durable: true, exclusive: false, autoDelete: false, arguments: null);
    }

    private static void Republish(IModel ch, string queue, byte[] body)
    {
        var p = ch.CreateBasicProperties();
        p.Persistent = true;
        p.ContentType = "application/json";
        ch.BasicPublish(string.Empty, queue, mandatory: false, basicProperties: p, body: body);
    }
}
