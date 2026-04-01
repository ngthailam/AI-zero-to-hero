import { exec } from "child_process";

export function run(command) {
  console.log("Running CLI executor skill... Command:", command);

  return new Promise((resolve) => {
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      const fullOutput = stdout + stderr;
      if (error) {
        console.error(`Command execution error: ${error}`);
        return resolve({
          success: false,
          output: stderr || fullOutput,
        });
      }

      console.log(`Command execution output: ${stdout}`);
      resolve({
        success: true,
        output: fullOutput,
      });
    });
  });
}
