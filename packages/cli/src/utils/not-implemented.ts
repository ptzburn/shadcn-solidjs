import console from "node:console";
import process from "node:process";

/**
 * Fails loudly for command surfaces that are declared but not yet built, so a
 * stub is never mistaken for working software.
 */
export function notImplemented(command: string): never {
  console.error(`\`${command}\` is not implemented yet.`);
  process.exit(1);
}
