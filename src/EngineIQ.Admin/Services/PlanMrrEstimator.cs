namespace EngineIQ.Admin.Services;

/// <summary>Estimated MRR (ZAR) by plan name until billing integration exists.</summary>
public static class PlanMrrEstimator
{
    public static decimal MonthlyZar(string? plan)
    {
        if (string.IsNullOrWhiteSpace(plan))
            return 0;
        return plan.Trim().ToLowerInvariant() switch
        {
            "starter" => 1_999m,
            "growth" => 4_999m,
            "enterprise" => 15_000m,
            _ => 0m
        };
    }
}
