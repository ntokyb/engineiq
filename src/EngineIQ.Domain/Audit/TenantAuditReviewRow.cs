namespace EngineIQ.Domain.Audit;

/// <summary>One completed PR review for tenant audit export (no finding text or source).</summary>
public sealed record TenantAuditReviewRow(
    DateTimeOffset Timestamp,
    int PrNumber,
    string RepositoryFullName,
    int FindingsCount,
    long? DurationMs,
    decimal? EstimatedCostZar,
    int InputTokens,
    int OutputTokens);
