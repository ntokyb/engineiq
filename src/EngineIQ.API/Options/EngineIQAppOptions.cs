namespace EngineIQ.API.Options;

public sealed class EngineIQAppOptions
{
    public const string SectionName = "EngineIQ";

    public string DashboardBaseUrl { get; set; } = "https://app.engineiq.io";
}
