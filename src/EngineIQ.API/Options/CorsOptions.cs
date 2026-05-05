namespace EngineIQ.API.Options;

public sealed class CorsOptions
{
    public const string SectionName = "Cors";

    /// <summary>Browser origins allowed to call the API (marketing + portal).</summary>
    public string[] AllowedOrigins { get; set; } = Array.Empty<string>();
}
