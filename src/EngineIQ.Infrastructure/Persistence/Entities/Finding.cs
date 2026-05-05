namespace EngineIQ.Infrastructure.Persistence.Entities;

/// <summary>
/// Non-sensitive finding metadata. <see cref="WasActioned"/> and <see cref="PrMergeStatus"/> are first-class for Phase 5 ML.
/// </summary>
public sealed class Finding
{
    public Guid Id { get; set; }
    public Guid JobId { get; set; }
    public Guid TenantId { get; set; }
    public string Severity { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string? RuleId { get; set; }
    public string Source { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public int? LineNumber { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool WasActioned { get; set; }
    public string PrMergeStatus { get; set; } = "unknown";
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>Optional JSON for future supervised / RL labels (Phase 5).</summary>
    public string? TrainingFeaturesJson { get; set; }

    public PrReviewJob? Job { get; set; }
    public Tenant? Tenant { get; set; }
}
