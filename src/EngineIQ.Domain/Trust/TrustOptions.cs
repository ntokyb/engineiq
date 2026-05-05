namespace EngineIQ.Domain.Trust;

/// <summary>Configurable trust / disclosure strings (appsettings section <c>Trust</c>).</summary>
public sealed class TrustOptions
{
    public const string SectionName = "Trust";

    /// <summary>Public API origin for links (no trailing slash), e.g. PR comment footer.</summary>
    public string PublicApiBaseUrl { get; set; } = "https://api.engineiq.co.za";

    public string DataLocation { get; set; } = "Hetzner SA / Johannesburg";

    /// <summary>Hosted DPA PDF for onboarding email and legal.</summary>
    public string DpaPdfUrl { get; set; } = "https://engineiq.co.za/legal/dpa.pdf";

    public string AiProvider { get; set; } = "Anthropic";
}
