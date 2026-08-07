export interface RegistryErrorOptions {
  cause?: unknown;
}

export class RegistryError extends Error {
  constructor(message: string, options?: RegistryErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class RegistryNotFoundError extends RegistryError {
  constructor(readonly url: string, options?: RegistryErrorOptions) {
    super(
      `The item at ${url} was not found. It may not exist at the registry.`,
      options,
    );
  }
}

export class RegistryUnauthorizedError extends RegistryError {
  constructor(readonly url: string, options?: RegistryErrorOptions) {
    super(`You are not authorized to access the item at ${url}.`, options);
  }
}

export class RegistryForbiddenError extends RegistryError {
  constructor(readonly url: string, options?: RegistryErrorOptions) {
    super(`Access to the item at ${url} is forbidden.`, options);
  }
}

export class RegistryFetchError extends RegistryError {
  constructor(
    readonly url: string,
    readonly status?: number,
    options?: RegistryErrorOptions,
  ) {
    super(
      `Failed to fetch the item at ${url}${status ? ` (HTTP ${status})` : ""}.`,
      options,
    );
  }
}

export class RegistryParseError extends RegistryError {
  constructor(readonly url: string, cause: unknown) {
    super(`The item at ${url} is not a valid registry item.`, { cause });
  }
}

export class RegistryNotConfiguredError extends RegistryError {
  constructor(readonly registry: string) {
    super(
      `Unknown registry "${registry}". Add it to the "registries" field in components.json.`,
    );
  }
}
