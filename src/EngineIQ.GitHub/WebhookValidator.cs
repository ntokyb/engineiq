using System.Security.Cryptography;
using System.Text;

namespace EngineIQ.GitHub;

/// <summary>
/// Validates GitHub webhook HMAC-SHA256 signature.
/// </summary>
public static class WebhookValidator
{
    public const string SignatureHeaderName = "X-Hub-Signature-256";
    public const string SignaturePrefix = "sha256=";

    public static bool ValidateSignature(string payloadBody, string signatureHeader, string secret)
    {
        if (string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(signatureHeader) || !signatureHeader.StartsWith(SignaturePrefix, StringComparison.OrdinalIgnoreCase))
            return false;

        var expectedHex = signatureHeader.AsSpan(SignaturePrefix.Length).ToString();
        var payloadBytes = Encoding.UTF8.GetBytes(payloadBody);
        var secretBytes = Encoding.UTF8.GetBytes(secret);

        var hash = HMACSHA256.HashData(secretBytes, payloadBytes);
        var actualHex = Convert.ToHexString(hash);

        if (expectedHex.Length != actualHex.Length)
            return false;

        var expectedBytes = Convert.FromHexString(expectedHex);
        return CryptographicOperations.FixedTimeEquals(hash, expectedBytes);
    }
}
