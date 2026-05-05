using EngineIQ.Admin.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace EngineIQ.Admin.Pages.Admin;

public sealed class MetricsModel : PageModel
{
    private readonly AdminPortalService _admin;

    public MetricsModel(AdminPortalService admin) => _admin = admin;

    public AdminPlatformMetrics? Metrics { get; private set; }

    public async Task OnGetAsync(CancellationToken cancellationToken)
    {
        Metrics = await _admin.GetPlatformMetricsAsync(cancellationToken);
    }
}
