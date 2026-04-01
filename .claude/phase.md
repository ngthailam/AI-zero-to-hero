# AI Agent System — Phase 4 (Production-Style)

## 🎯 Objective

Build a context-aware, multi-file, self-correcting AI agent that:

- Breaks down tasks into steps
- Executes steps via predefined skills
- Maintains shared state (context)
- Generates and updates multiple files
- Runs tests and fixes failures iteratively

---

## 🧠 Architecture Overview

System consists of:

1. Planner (LLM)
2. Validator (schema)
3. Executor (skill runner)
4. Context (shared state)
5. Skills (modular tools)
6. Loop (plan → execute → evaluate → replan)

---

## 📦 Core Concepts

---

### 1. Shared Context (State)

All data flows through a single object:

```js
const context = {
  files: {},          // { [filePath]: content }
  testResults: null,  // latest test execution result
  history: [],        // [{ step, result }]
};
```
