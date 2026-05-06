namespace EngineIQ.Domain.Jobs;

/// <summary>PR review job metadata for tenant portal — no webhook ids or source content.</summary>
public sealed record TenantPrJobRow(
    Guid JobId,
    string RepositoryFullName,
    int PrNumber,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? CompletedAt,
    long? DurationMs,
    int FindingsCount,
    int InputTokens,
    int OutputTokens,
    decimal? EstimatedCostZar);
