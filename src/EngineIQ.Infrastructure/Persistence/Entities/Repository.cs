namespace EngineIQ.Infrastructure.Persistence.Entities;

public sealed class Repository
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string? ArchitectureStyle { get; set; }
    public DateTimeOffset? LastIndexedAt { get; set; }

    public Tenant? Tenant { get; set; }
    public ICollection<PrReviewJob> Jobs { get; set; } = new List<PrReviewJob>();
}
