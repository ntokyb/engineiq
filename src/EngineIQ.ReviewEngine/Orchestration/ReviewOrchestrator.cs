using EngineIQ.Domain.Interfaces;
using EngineIQ.Domain.Reviews;

namespace EngineIQ.ReviewEngine.Orchestration;

/// <summary>
/// In-memory PR review: diff → Claude → GitHub comment (no persistence of source).
/// </summary>
public sealed class ReviewOrchestrator : IReviewOrchestrator
{
    private readonly IGitHubClient _gitHubClient;
    private readonly IAIEngine _aiEngine;

    public ReviewOrchestrator(IGitHubClient gitHubClient, IAIEngine aiEngine)
    {
        _gitHubClient = gitHubClient;
        _aiEngine = aiEngine;
    }

    public async Task<PrReviewDiffOutcome> ReviewPullRequestAsync(
        long installationId,
        string owner,
        string repo,
        int prNumber,
        CancellationToken cancellationToken = default)
    {
        var diff = await _gitHubClient.GetPullRequestDiffAsync(installationId, owner, repo, prNumber, cancellationToken);
        var outcome = await _aiEngine.ReviewDiffAsync(diff, cancellationToken);
        await _gitHubClient.PostReviewCommentAsync(installationId, owner, repo, prNumber, outcome.CommentBody, cancellationToken);
        return outcome;
    }
}
