using System.Text.Json;

namespace EngineIQ.AIEngine.Anthropic;

/// <summary>
/// Parses Anthropic Messages API JSON responses (assistant text + usage). Testable without HTTP.
/// </summary>
public static class AnthropicReviewResponseParser
{
    /// <summary>PR comment footer linking to the public <c>/security</c> disclosure.</summary>
    public static string BuildTrustFooter(string publicApiBaseUrl)
    {
        var baseUrl = (publicApiBaseUrl ?? "https://api.engineiq.co.za").TrimEnd('/');
        return $"""

---

EngineIQ processed this diff ephemerally. No source code was stored. Findings metadata only is retained for your dashboard. [View our security model]({baseUrl}/security)
""";
    }

    /// <summary>Heuristic count of list-style review bullets (no persisted finding rows required).</summary>
    public static int EstimateBulletFindingCount(string markdown)
    {
        if (string.IsNullOrWhiteSpace(markdown))
            return 0;

        var count = 0;
        foreach (var line in markdown.Split('\n'))
        {
            var t = line.TrimStart();
            if (t.StartsWith("- ", StringComparison.Ordinal) || t.StartsWith("* ", StringComparison.Ordinal))
            {
                count++;
                continue;
            }

            if (t.Length > 2 && char.IsDigit(t[0]))
            {
                var dot = t.IndexOf('.', StringComparison.Ordinal);
                if (dot is > 0 and < 5 && dot < t.Length - 1 && char.IsWhiteSpace(t[dot + 1]))
                    count++;
            }
        }

        return count;
    }

    /// <summary>
    /// Extracts concatenated text blocks from the assistant message content array.
    /// </summary>
    public static bool TryParseAssistantText(JsonElement root, out string text)
    {
        text = string.Empty;
        if (!root.TryGetProperty("content", out var content) || content.ValueKind != JsonValueKind.Array)
            return false;

        var sb = new System.Text.StringBuilder();
        foreach (var block in content.EnumerateArray())
        {
            if (block.TryGetProperty("type", out var typeEl) &&
                typeEl.GetString() == "text" &&
                block.TryGetProperty("text", out var textEl))
            {
                sb.Append(textEl.GetString());
            }
        }

        text = sb.ToString().Trim();
        return text.Length > 0;
    }

    public static bool TryParseUsage(JsonElement root, out int inputTokens, out int outputTokens)
    {
        inputTokens = 0;
        outputTokens = 0;
        if (!root.TryGetProperty("usage", out var usage) || usage.ValueKind != JsonValueKind.Object)
            return false;

        if (usage.TryGetProperty("input_tokens", out var inEl) && inEl.TryGetInt32(out var i))
            inputTokens = i;
        if (usage.TryGetProperty("output_tokens", out var outEl) && outEl.TryGetInt32(out var o))
            outputTokens = o;

        return true;
    }

    /// <summary>
    /// Estimates ZAR cost from token counts and USD list prices × FX (for structured logs only).
    /// </summary>
    public static decimal EstimateZarCost(
        int inputTokens,
        int outputTokens,
        double inputUsdPerMillion,
        double outputUsdPerMillion,
        double usdToZar)
    {
        var inputUsd = inputTokens / 1_000_000.0 * inputUsdPerMillion;
        var outputUsd = outputTokens / 1_000_000.0 * outputUsdPerMillion;
        return (decimal)((inputUsd + outputUsd) * usdToZar);
    }
}
