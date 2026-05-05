using EngineIQ.Domain.Messaging;

namespace EngineIQ.Domain.Interfaces;

public interface IPullReviewJobPublisher
{
    Task PublishAsync(PullReviewJobMessage job, CancellationToken cancellationToken = default);
}
