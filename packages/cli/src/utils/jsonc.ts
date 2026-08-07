/**
 * A minimal JSONC reader for `deno.jsonc`.
 *
 * Hand-rolled rather than pulling `@std/jsonc`: a `jsr:` dependency is
 * rewritten to an `@jsr/`-scoped package by the npm build, which would force
 * every npm consumer to configure the JSR registry just to run the CLI.
 */
export function parseJsonc(text: string): unknown {
  return JSON.parse(stripComments(text));
}

function stripComments(text: string): string {
  let out = "";
  /** Offsets in `out` holding a comma that sits outside any string. */
  const commas: number[] = [];

  let inString = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inLineComment) {
      if (char === "\n") {
        inLineComment = false;
        out += char;
      }
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      out += char;
      if (char === "\\") {
        out += next ?? "";
        i++;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      out += char;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }

    if (char === ",") commas.push(out.length);
    out += char;
  }

  return removeTrailingCommas(out, commas);
}

/**
 * Drops only those commas that are followed by a closing brace or bracket.
 * Working from recorded offsets rather than a regex means a comma *inside* a
 * string value can never be mistaken for a trailing one.
 */
function removeTrailingCommas(text: string, commas: number[]): string {
  let result = text;

  for (let i = commas.length - 1; i >= 0; i--) {
    const at = commas[i];
    let cursor = at + 1;
    while (cursor < result.length && /\s/.test(result[cursor])) cursor++;
    if (result[cursor] === "}" || result[cursor] === "]") {
      result = result.slice(0, at) + result.slice(at + 1);
    }
  }

  return result;
}
