using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using EngineIQ.Admin.Options;
using Microsoft.Extensions.Options;

namespace EngineIQ.Admin.Middleware;

public sealed class BasicAuthMiddleware
{
    private readonly RequestDelegate _next;
    private readonly AdminAuthOptions _options;

    public BasicAuthMiddleware(RequestDelegate next, IOptions<AdminAuthOptions> options)
    {
        _next = next;
        _options = options.Value;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Headers.TryGetValue("Authorization", out var header)
            || !AuthenticationHeaderValue.TryParse(header, out var auth)
            || !string.Equals(auth.Scheme, "Basic", StringComparison.OrdinalIgnoreCase)
            || string.IsNullOrEmpty(auth.Parameter))
        {
            Challenge(context);
            return;
        }

        string pair;
        try
        {
            pair = Encoding.UTF8.GetString(Convert.FromBase64String(auth.Parameter));
        }
        catch
        {
            Challenge(context);
            return;
        }

        var sep = pair.IndexOf(':', StringComparison.Ordinal);
        if (sep <= 0)
        {
            Challenge(context);
            return;
        }

        var user = pair[..sep];
        var pass = pair[(sep + 1)..];

        var expectedUser = _options.Username ?? string.Empty;
        var expectedPass = _options.Password ?? string.Empty;
        if (!Utf8FixedTimeEquals(user, expectedUser) || !Utf8FixedTimeEquals(pass, expectedPass))
        {
            Challenge(context);
            return;
        }

        await _next(context);
    }

    private static bool Utf8FixedTimeEquals(string a, string b)
    {
        var ba = Encoding.UTF8.GetBytes(a);
        var bb = Encoding.UTF8.GetBytes(b);
        if (ba.Length != bb.Length)
            return false;
        return CryptographicOperations.FixedTimeEquals(ba, bb);
    }

    private static void Challenge(HttpContext context)
    {
        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        context.Response.Headers.WWWAuthenticate = "Basic realm=\"EngineIQ Admin\"";
    }
}
