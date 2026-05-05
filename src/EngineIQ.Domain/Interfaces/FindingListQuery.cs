namespace EngineIQ.Domain.Interfaces;

public sealed record FindingListQuery(
    string? Severity = null,
    string? FileContains = null,
    string? RuleId = null,
    int Skip = 0,
    int Take = 50);
