# Plan — Phase 4 Implementation

## What's Already Done
- SKILL_TYPES: GENERATE_CODE, WRITE_TEST, RUN_TESTS, FIX_CODE ✓
- All skill files implemented with multi-file output format ✓
- Agent planner calls OpenAI and routes to skills ✓

## What Needs to Be Done

### 1. Structured Context
Replace the flat `{}` context in agent.js with the schema from phase.md:
```js
{ files: {}, testResults: null, history: [] }
```
- `files`: map of `{ [filePath]: content }` — updated after GENERATE_CODE and FIX_CODE
- `testResults`: updated after RUN_TESTS
- `history`: append `{ step, result }` after each skill execution

### 2. Validator
Create `src/core/validator/stepValidator.js` — validates the planner's JSON output against the required schema before execution. Throws on invalid steps so bad plans fail fast.

### 3. Fix Loop
After the planned steps complete, if `testResults` indicates failure:
- Run FIX_CODE with current files + testResults
- Run RUN_TESTS again
- Repeat up to MAX_FIX_ATTEMPTS (3)
- Stop early if tests pass

## Files to Change
- `src/core/agent/agent.js` — structured context + loop
- `src/core/memory/simpleContext.js` — update to new shape
- `src/core/validator/stepValidator.js` — new file
