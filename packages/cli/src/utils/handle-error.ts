import process from "node:process";

import { logger } from "./logger.ts";

/**
 * Prints a failure and exits non-zero. The `cause` chain is surfaced because
 * the useful detail — a zod issue, an ENOENT — usually lives one level down.
 */
export function handleError(error: unknown): never {
  if (error instanceof Error) {
    logger.error(error.message);

    let cause = error.cause;
    while (cause instanceof Error) {
      logger.error(`  caused by: ${cause.message}`);
      cause = cause.cause;
    }
    if (cause && !(cause instanceof Error)) {
      logger.error(`  caused by: ${JSON.stringify(cause, null, 2)}`);
    }
  } else {
    logger.error(String(error));
  }

  process.exit(1);
}
