namespace EngineIQ.Admin.Options;

public sealed class AdminAuthOptions
{
    public const string SectionName = "Admin";

    /// <summary>Basic-auth user (e.g. ENGINEIQ_ADMIN__USERNAME).</summary>
    public string Username { get; set; } = "engineiq-admin";

    /// <summary>Basic-auth password from environment only in production.</summary>
    public string Password { get; set; } = "change-me";
}
