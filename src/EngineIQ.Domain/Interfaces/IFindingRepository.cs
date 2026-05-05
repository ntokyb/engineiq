namespace EngineIQ.Domain.Interfaces;

/// <summary>
/// Persisted finding metadata only (no source code). <see cref="WasActioned"/> and <see cref="PrMergeStatus"/> feed Phase 5 ML.
/// </summary>
public interface IFindingRepository
{
    Task AddFindingsAsync(Guid tenantId, Guid jobId, IReadOnlyList<FindingWriteDto> findings, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<FindingReadDto>> ListByJobAsync(Guid tenantId, Guid jobId, CancellationToken cancellationToken = default);

    Task<(IReadOnlyList<FindingReadDto> Items, int TotalCount)> ListForTenantAsync(
        Guid tenantId,
        FindingListQuery query,
        CancellationToken cancellationToken = default);
}

public sealed record FindingWriteDto(
    string Severity,
    string Category,
    string? RuleId,
    string Source,
    string FilePath,
    int? LineNumber,
    string Message,
    bool WasActioned,
    string PrMergeStatus,
    string? TrainingFeaturesJson);

public sealed record FindingReadDto(
    Guid Id,
    string Severity,
    string Category,
    string? RuleId,
    string Source,
    string FilePath,
    int? LineNumber,
    string Message,
    bool WasActioned,
    string PrMergeStatus,
    string? TrainingFeaturesJson,
    DateTimeOffset CreatedAt);
