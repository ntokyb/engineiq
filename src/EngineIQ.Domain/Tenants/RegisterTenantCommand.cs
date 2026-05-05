namespace EngineIQ.Domain.Tenants;

public sealed record RegisterTenantCommand(
    string Email,
    string CompanyName,
    string Plan,
    string GithubOrg,
    string? DpaAcceptedIp);
