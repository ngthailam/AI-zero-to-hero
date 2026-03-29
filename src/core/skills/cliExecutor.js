import { exec } from "child_process";

export function run(command) {
  console.log("Running CLI executor skill... Command:", command);

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Command execution error: ${error}`);
        return resolve({
          success: false,
          output: stderr || stdout,
        });
      }

      console.log(`Command execution output: ${stdout}`);
      resolve({
        success: true,
        output: stdout,
      });
    });
  });
}
