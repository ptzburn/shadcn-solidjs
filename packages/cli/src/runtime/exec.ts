import { spawn } from "node:child_process";

export interface ExecOptions {
  cwd: string;
  silent?: boolean;
}

export class ExecError extends Error {
  readonly command: string;
  readonly code: number | null;
  readonly stderr: string;

  constructor(command: string, code: number | null, stderr: string) {
    super(`\`${command}\` exited with code ${code}${stderr ? `:\n${stderr.trim()}` : "."}`);
    this.name = "ExecError";
    this.command = command;
    this.code = code;
    this.stderr = stderr;
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
