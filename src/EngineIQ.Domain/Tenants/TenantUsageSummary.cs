namespace EngineIQ.Domain.Tenants;

public sealed record TenantUsageSummary(
    int Days,
    int CompletedReviews,
    long TotalInputTokens,
    long TotalOutputTokens,
    decimal TotalEstimatedCostZar);
