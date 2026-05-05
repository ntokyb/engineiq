namespace EngineIQ.AIEngine;

public class AnthropicOptions
{
    public const string SectionName = "Anthropic";

    /// <summary>API key from environment / secret injection. Never log.</summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>Anthropic model id, e.g. claude-sonnet-4-6.</summary>
    public string Model { get; set; } = "claude-sonnet-4-6";

    /// <summary>USD→ZAR for cost estimates in logs.</summary>
    public double UsdToZar { get; set; } = 18.5;

    /// <summary>Published API price per million input tokens (USD).</summary>
    public double InputUsdPerMillionTokens { get; set; } = 3.0;

    /// <summary>Published API price per million output tokens (USD).</summary>
    public double OutputUsdPerMillionTokens { get; set; } = 15.0;

    /// <summary>Max tokens for assistant reply (Messages API requires max_tokens).</summary>
    public int MaxOutputTokens { get; set; } = 4096;
}
