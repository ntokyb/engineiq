namespace EngineIQ.Domain.Entities;

/// <summary>
/// Represents a pull request review job. Created on webhook receipt; processed by worker.
/// </summary>
public class PRReviewJob
{
    public required string JobId { get; init; }
    public required long InstallationId { get; init; }
    public required string Owner { get; init; }
    public required string Repo { get; init; }
    public required int PRNumber { get; init; }
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;
}
