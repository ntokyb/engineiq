namespace EngineIQ.GitHub;

public class GitHubClientOptions
{
    public const string SectionName = "GitHub";

    public long AppId { get; set; }
    /// <summary>GitHub App slug for <c>https://github.com/apps/{slug}/installations/new</c> onboarding links.</summary>
    public string AppSlug { get; set; } = string.Empty;
    public string PrivateKeyPem { get; set; } = string.Empty;
    public string? WebhookSecret { get; set; }
}
