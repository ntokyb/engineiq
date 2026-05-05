namespace EngineIQ.Domain.Tenants;

/// <param name="GithubInstallState">One-time <c>state</c> query parameter for the GitHub App install URL.</param>
/// <param name="WebhookSecretPlaintext">Shown once in welcome email; only a hash is stored.</param>
public sealed record RegisterTenantResult(
    Guid TenantId,
    string ApiKey,
    string GithubInstallState,
    string WebhookSecretPlaintext);
