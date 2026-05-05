namespace EngineIQ.Domain.Messaging;

/// <summary>
/// Queue payload for PR review jobs. No diff or source in the message.
/// </summary>
public sealed record PullReviewJobMessage(
    Guid TenantId,
    Guid JobId,
    Guid RepositoryId,
    long InstallationId,
    string Owner,
    string Repo,
    int PrNumber,
    int Attempt = 0);
