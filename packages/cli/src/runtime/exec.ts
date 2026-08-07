import { spawn } from "node:child_process";

export interface ExecOptions {
  cwd: string;
  silent?: boolean;
}

export class ExecError extends Error {
  constructor(
    readonly command: string,
    readonly code: number | null,
    readonly stderr: string,
  ) {
    super(
      `\`${command}\` exited with code ${code}${
        stderr ? `:\n${stderr.trim()}` : "."
      }`,
    );
    this.name = "ExecError";
  }
}

/**
 * Runs a command, rejecting on a non-zero exit.
 *
 * `shell` is deliberately never enabled: arguments reach the child process
 * as a list, so a package name can never be reinterpreted by a shell.
 */
export function exec(
  command: string,
  args: string[],
  options: ExecOptions,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      stdio: options.silent ? "pipe" : ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => (stdout += chunk));
    child.stderr?.on("data", (chunk) => (stderr += chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }
      reject(new ExecError(`${command} ${args.join(" ")}`, code, stderr));
    });
  });
}
