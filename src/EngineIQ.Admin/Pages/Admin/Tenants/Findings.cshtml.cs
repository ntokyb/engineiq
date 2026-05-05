using EngineIQ.Admin.Services;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace EngineIQ.Admin.Pages.Admin.Tenants;

public sealed class FindingsModel : PageModel
{
    private readonly AdminPortalService _admin;

    public FindingsModel(AdminPortalService admin) => _admin = admin;

    public Guid TenantId { get; set; }
    public IReadOnlyList<AdminFindingRow> Findings { get; private set; } = Array.Empty<AdminFindingRow>();

    public async Task OnGetAsync(Guid id, CancellationToken cancellationToken)
    {
        TenantId = id;
        Findings = await _admin.ListFindingsAsync(id, 500, cancellationToken);
    }
}
