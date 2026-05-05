namespace EngineIQ.Infrastructure;

public class RabbitMqOptions
{
    public const string SectionName = "RabbitMq";

    public string ConnectionString { get; set; } = "amqp://guest:guest@localhost:5672/";

    public string QueueName { get; set; } = "pr-review-jobs";

    public string DeadLetterQueueName { get; set; } = "pr-review-jobs-dlq";
}
