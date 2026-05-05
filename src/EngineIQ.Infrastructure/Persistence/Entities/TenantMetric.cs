namespace EngineIQ.Infrastructure.Persistence.Entities;

public sealed class TenantMetric
{
    public Guid TenantId { get; set; }
    public DateOnly Date { get; set; }
    public int PrsReviewed { get; set; }
    public int ViolationsFound { get; set; }
    public double AvgReviewMs { get; set; }
    public decimal TokenCostZar { get; set; }

    public Tenant? Tenant { get; set; }
}
