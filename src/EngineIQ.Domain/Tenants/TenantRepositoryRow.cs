namespace EngineIQ.Domain.Tenants;

public sealed record TenantRepositoryRow(Guid Id, string FullName, int JobCount);
