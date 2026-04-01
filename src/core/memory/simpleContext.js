export function createContext() {
  return {
    files: {},         // { [filePath]: content }
    testResults: null, // latest test execution result
    history: [],       // [{ step, result }]
  };
}
