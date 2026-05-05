namespace EngineIQ.Domain.Tenants;

public sealed record TenantAccountSnapshot(
    Guid TenantId,
    string CompanyName,
    string Plan,
    string Status,
    string? ContactEmail,
    string? GitHubOrgLogin,
    bool GitHubAppConnected,
    long? GitHubAppInstallationId,
    bool HasConfigYaml);

public sealed record DailyCountDto(DateOnly Date, int Count);

public sealed record TenantDashboardAnalytics(
    int Days,
    int PrsReviewedInPeriod,
    int ViolationsInPeriod,
    IReadOnlyList<DailyCountDto> PrsReviewedPerDay,
    IReadOnlyList<DailyCountDto> ViolationsPerDay,
    int ArchitectureDriftScore,
    string ArchitectureDriftNote);
