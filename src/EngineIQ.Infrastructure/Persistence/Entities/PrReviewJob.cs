namespace EngineIQ.Infrastructure.Persistence.Entities;

public sealed class PrReviewJob
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid RepositoryId { get; set; }
    public int PrNumber { get; set; }
    public string GithubDeliveryId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? CompletedAt { get; set; }
    public long? DurationMs { get; set; }
    public int FindingsCount { get; set; }
    public int InputTokens { get; set; }
    public int OutputTokens { get; set; }
    public decimal? EstimatedCostZar { get; set; }

    public Tenant? Tenant { get; set; }
    public Repository? Repository { get; set; }
    public ICollection<Finding> Findings { get; set; } = new List<Finding>();
}
