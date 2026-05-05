using EngineIQ.Domain.Tenants;

namespace EngineIQ.Domain.Interfaces;

public interface ITenantRepository
{
    Task<RegisterTenantResult> RegisterAsync(RegisterTenantCommand command, CancellationToken cancellationToken = default);

    /// <summary>Links GitHub App installation to the tenant identified by the one-time <paramref name="installState"/> from the install URL.</summary>
    Task<(bool Ok, Guid? TenantId, string? ContactEmail, string? Error)> CompleteGitHubInstallAsync(
        long installationId,
        string installState,
        CancellationToken cancellationToken = default);

    Task<Guid?> ValidateApiKeyAndGetTenantIdAsync(string apiKey, CancellationToken cancellationToken = default);

    Task<TenantStatusSnapshot?> GetStatusSnapshotAsync(Guid tenantId, CancellationToken cancellationToken = default);

    Task UpdateConfigYamlAsync(Guid tenantId, string? yaml, CancellationToken cancellationToken = default);

    Task<TenantAccountSnapshot?> GetAccountSnapshotAsync(Guid tenantId, CancellationToken cancellationToken = default);

    Task<string?> GetConfigYamlAsync(Guid tenantId, CancellationToken cancellationToken = default);

    Task<TenantDashboardAnalytics?> GetDashboardAnalyticsAsync(Guid tenantId, int days, CancellationToken cancellationToken = default);
}
