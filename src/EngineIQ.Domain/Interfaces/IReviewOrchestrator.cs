using EngineIQ.Domain.Reviews;

namespace EngineIQ.Domain.Interfaces;

/// <summary>
/// Runs the full in-memory PR review pipeline (diff → AI → comment).
/// </summary>
public interface IReviewOrchestrator
{
    Task<PrReviewDiffOutcome> ReviewPullRequestAsync(
        long installationId,
        string owner,
        string repo,
        int prNumber,
        CancellationToken cancellationToken = default);
}
