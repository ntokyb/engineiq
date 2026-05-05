using EngineIQ.Admin.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace EngineIQ.Admin.Pages.Admin.Jobs;

public sealed class DeadLetterModel : PageModel
{
    private readonly AdminPortalService _admin;
    private readonly DlqRetryService _dlq;

    public DeadLetterModel(AdminPortalService admin, DlqRetryService dlq)
    {
        _admin = admin;
        _dlq = dlq;
    }

    public IReadOnlyList<AdminFailedJobRow> FailedDbJobs { get; private set; } = Array.Empty<AdminFailedJobRow>();
    public IReadOnlyList<string> DlqPreviews { get; private set; } = Array.Empty<string>();
    public string? Error { get; set; }

    public async Task OnGetAsync(CancellationToken cancellationToken)
    {
        FailedDbJobs = await _admin.ListFailedJobsAsync(cancellationToken);
        try
        {
            DlqPreviews = _dlq.PeekDlqJsonPreviews(50);
        }
        catch (Exception ex)
        {
            Error = $"DLQ peek failed: {ex.Message}";
            DlqPreviews = Array.Empty<string>();
        }
    }

    public async Task<IActionResult> OnPostRetryDbJobAsync(Guid tenantId, Guid jobId, CancellationToken cancellationToken)
    {
        try
        {
            await _admin.RetryFailedDbJobAsync(tenantId, jobId, cancellationToken);
            TempData["Flash"] = "Job re-queued.";
        }
        catch (Exception ex)
        {
            TempData["Flash"] = $"Retry failed: {ex.Message}";
        }

        return RedirectToPage();
    }

    public IActionResult OnPostRetryDlqAsync(int index)
    {
        try
        {
            var n = _dlq.RetryMessageAtIndex(index);
            TempData["Flash"] = n == 0 ? "DLQ was empty." : $"DLQ retry OK ({n} messages drained).";
        }
        catch (Exception ex)
        {
            TempData["Flash"] = $"DLQ retry failed: {ex.Message}";
        }

        return RedirectToPage();
    }
}
