namespace EngineIQ.Domain.Tenants;

public sealed record TenantStatusSnapshot(
    string OnboardingStatus,
    int RepositoriesDetected,
    bool FirstPrReviewed);
