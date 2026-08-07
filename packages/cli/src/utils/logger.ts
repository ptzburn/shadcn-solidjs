import console from "node:console";

let muted = false;

export function setSilent(value: boolean): void {
  muted = value;
}

/** Errors bypass `--silent`: a failure the user cannot see is worse than noise. */
export const logger = {
  log(message = ""): void {
    if (!muted) console.log(message);
  },
  success(message: string): void {
    if (!muted) console.log(`✔ ${message}`);
  },
  info(message: string): void {
    if (!muted) console.log(`- ${message}`);
  },
  warn(message: string): void {
    if (!muted) console.warn(`! ${message}`);
  },
  error(message: string): void {
    console.error(`✖ ${message}`);
  },
};
