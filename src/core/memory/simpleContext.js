export let context = {
  files: {}, // { [filePath]: content }
  testResults: null, // latest test execution result
  history: [], // [{ step, result }]
};
