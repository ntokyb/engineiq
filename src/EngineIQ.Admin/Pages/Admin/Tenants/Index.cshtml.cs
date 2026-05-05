using EngineIQ.Admin.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace EngineIQ.Admin.Pages.Admin.Tenants;

public sealed class IndexModel : PageModel
{
    private readonly AdminPortalService _admin;

    public IndexModel(AdminPortalService admin) => _admin = admin;

    public IReadOnlyList<AdminTenantRow> Tenants { get; private set; } = Array.Empty<AdminTenantRow>();

    public async Task OnGetAsync(CancellationToken cancellationToken)
    {
        Tenants = await _admin.ListTenantsAsync(cancellationToken);
    }

    public async Task<IActionResult> OnPostSuspendAsync(Guid id, CancellationToken cancellationToken)
    {
        await _admin.SuspendTenantAsync(id, cancellationToken);
        return RedirectToPage();
    }

    public async Task<IActionResult> OnPostUpgradeAsync(Guid id, string plan, string? featureFlagsJson, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(plan))
            return RedirectToPage();
        await _admin.UpgradeTenantAsync(id, plan, featureFlagsJson, cancellationToken);
        return RedirectToPage();
    }
}
