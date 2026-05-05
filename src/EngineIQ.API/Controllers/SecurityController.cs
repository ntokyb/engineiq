using System.Text.Json.Serialization;
using EngineIQ.Domain.Trust;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace EngineIQ.API.Controllers;

/// <summary>Public trust / data-processing disclosure for CTO and legal verification.</summary>
[ApiController]
public sealed class SecurityController : ControllerBase
{
    [HttpGet("/security")]
    [EnableCors("Portal")]
    [Produces("application/json")]
    public ActionResult<SecurityDisclosureResponse> Get([FromServices] IOptions<TrustOptions> trust)
    {
        var t = trust.Value;
        return Ok(new SecurityDisclosureResponse(
            EphemeralProcessing: true,
            CodePersisted: false,
            DataLocation: t.DataLocation,
            AiProvider: t.AiProvider,
            AiTraining: false,
            AuditLogAvailable: true));
    }

    public sealed record SecurityDisclosureResponse(
        [property: JsonPropertyName("ephemeral_processing")] bool EphemeralProcessing,
        [property: JsonPropertyName("code_persisted")] bool CodePersisted,
        [property: JsonPropertyName("data_location")] string DataLocation,
        [property: JsonPropertyName("ai_provider")] string AiProvider,
        [property: JsonPropertyName("ai_training")] bool AiTraining,
        [property: JsonPropertyName("audit_log_available")] bool AuditLogAvailable);
}
