# Version History

## v1.0.0
Initial project — basic Express server with OpenAI integration, single-file code generation, and test generation/execution.

## v2.0.0
Restructured to AI planner + plug-and-play skills architecture. Agent uses OpenAI to decompose tasks into steps and orchestrate skill execution.

## v3.0.0
Added WRITE_TEST and FIX_CODE skill types. All code-related skills now support multi-file output format `{ files: [{ path, content }] }`.

## v4.0.0
Phase 4 — Production-style agent with:
- Structured shared context `{ files, testResults, history }` flowing through all steps
- Step schema validator (`stepValidator.js`) that fails fast on invalid planner output
- Automatic fix loop: after tests run, if failures detected, FIX_CODE + RUN_TESTS retries up to 3 times
- `parseJson` utility in openAi.js to robustly strip markdown fences before JSON.parse
- simpleContext.js refactored to `createContext()` factory

## v5.0.0
Phase 5 — Git-integrated workflow with PR automation and CI/CD:
- `gitManager.js`: wraps git CLI for branch creation, staging, committing, pushing
- Feature branch auto-created per task (`feature/<task-slug>`)
- `gitCommit.js`: AI generates conventional commit message, then stages + commits + pushes
- `createPr.js`: uses `gh` CLI to create PR with AI-written title and markdown body (body written to temp file to avoid shell escaping issues)
- `checkReview.js`: reads PR review status and comments via `gh pr view`
- New SKILL_TYPES: `GIT_COMMIT`, `CREATE_PR`, `CHECK_REVIEW`
- `.github/workflows/ci.yml`: CI pipeline runs `npm test` on push to `feature/**` and PRs to main
- API response now includes `prUrl`, `branch`, and `testsPassed`
