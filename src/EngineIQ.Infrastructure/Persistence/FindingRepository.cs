using EngineIQ.Domain.Interfaces;
using EngineIQ.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace EngineIQ.Infrastructure.Persistence;

public sealed class FindingRepository : IFindingRepository
{
    private readonly IDbContextFactory<EngineIQDbContext> _factory;

    public FindingRepository(IDbContextFactory<EngineIQDbContext> factory)
    {
        _factory = factory;
    }

    public async Task AddFindingsAsync(Guid tenantId, Guid jobId, IReadOnlyList<FindingWriteDto> findings, CancellationToken cancellationToken = default)
    {
        if (findings.Count == 0) return;

        await using var db = await _factory.CreateDbContextAsync(cancellationToken);
        await db.SetCurrentTenantAsync(tenantId, cancellationToken);

        var now = DateTimeOffset.UtcNow;
        foreach (var f in findings)
        {
            db.Findings.Add(new Finding
            {
                Id = Guid.NewGuid(),
                JobId = jobId,
                TenantId = tenantId,
                Severity = f.Severity,
                Category = f.Category,
                RuleId = f.RuleId,
                Source = f.Source,
                FilePath = f.FilePath,
                LineNumber = f.LineNumber,
                Message = f.Message,
                WasActioned = f.WasActioned,
                PrMergeStatus = f.PrMergeStatus,
                CreatedAt = now,
                TrainingFeaturesJson = f.TrainingFeaturesJson
            });
        }

        await db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<FindingReadDto>> ListByJobAsync(Guid tenantId, Guid jobId, CancellationToken cancellationToken = default)
    {
        await using var db = await _factory.CreateDbContextAsync(cancellationToken);
        await db.SetCurrentTenantAsync(tenantId, cancellationToken);

        var rows = await db.Findings
            .AsNoTracking()
            .Where(x => x.JobId == jobId && x.TenantId == tenantId)
            .OrderBy(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return rows
            .Select(x => new FindingReadDto(
                x.Id,
                x.Severity,
                x.Category,
                x.RuleId,
                x.Source,
                x.FilePath,
                x.LineNumber,
                x.Message,
                x.WasActioned,
                x.PrMergeStatus,
                x.TrainingFeaturesJson,
                x.CreatedAt))
            .ToList();
    }

    public async Task<(IReadOnlyList<FindingReadDto> Items, int TotalCount)> ListForTenantAsync(
        Guid tenantId,
        FindingListQuery query,
        CancellationToken cancellationToken = default)
    {
        var take = Math.Clamp(query.Take, 1, 200);
        var skip = Math.Max(0, query.Skip);

        await using var db = await _factory.CreateDbContextAsync(cancellationToken);
        await db.SetCurrentTenantAsync(tenantId, cancellationToken);

        var q = db.Findings.AsNoTracking().Where(f => f.TenantId == tenantId);

        if (!string.IsNullOrWhiteSpace(query.Severity))
            q = q.Where(f => f.Severity == query.Severity);

        if (!string.IsNullOrWhiteSpace(query.FileContains))
        {
            var pattern = $"%{query.FileContains.Trim()}%";
            q = q.Where(f => EF.Functions.ILike(f.FilePath, pattern));
        }

        if (!string.IsNullOrWhiteSpace(query.RuleId))
            q = q.Where(f => f.RuleId == query.RuleId);

        var total = await q.CountAsync(cancellationToken);
        var rows = await q
            .OrderByDescending(f => f.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

        var items = rows
            .Select(x => new FindingReadDto(
                x.Id,
                x.Severity,
                x.Category,
                x.RuleId,
                x.Source,
                x.FilePath,
                x.LineNumber,
                x.Message,
                x.WasActioned,
                x.PrMergeStatus,
                x.TrainingFeaturesJson,
                x.CreatedAt))
            .ToList();

        return (items, total);
    }
}
