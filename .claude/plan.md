# Plan — Phase 5: Git Integration & PR Automation

## What's Already Done (Phase 4)
- Structured context { files, testResults, history } ✓
- Step schema validator ✓
- Auto fix loop (test → fix → retest, max 3 attempts) ✓
- parseJson utility ✓

## Phase 5 New Components

### 1. gitManager.js (`src/core/git/gitManager.js`)
Wraps git CLI operations via cliExecutor:
- `createBranch(name)` — checkout -b feature/<slug>
- `stageAll()` — git add .
- `commit(message)` — git commit
- `push(branch)` — git push -u origin

### 2. New SKILL_TYPES
- `GIT_COMMIT` — AI writes commit message, then commits + pushes
- `CREATE_PR` — creates PR via `gh` CLI
- `CHECK_REVIEW` — reads PR review comments via `gh` CLI

### 3. New Skills
- `gitCommit.js` — AI generates commit message from context, stages all, commits, pushes
- `createPr.js` — uses `gh pr create` with AI-written title/body
- `checkReview.js` — uses `gh pr view` to check review status/comments

### 4. CI/CD
- `.github/workflows/ci.yml` — runs `npm test` on push to feature/* and on PRs to main

### 5. Agent.js Upgrades
- At start: create feature branch from task slug
- After fix loop: auto git commit + push + create PR
- Store prUrl in context

## Agent Flow (Phase 5)
1. Create feature branch `feature/<task-slug>`
2. Execute planned steps (generate_code, write_test)
3. Auto run_tests if not in plan
4. Fix loop (up to 3 attempts)
5. Auto git_commit (AI message, push branch)
6. Auto create_pr (AI title/body)
7. Return context with prUrl
