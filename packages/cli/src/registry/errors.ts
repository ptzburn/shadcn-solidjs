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
  readonly url: string;

  constructor(url: string, options?: RegistryErrorOptions) {
    super(`The item at ${url} was not found. It may not exist at the registry.`, options);
    this.url = url;
  }
}

export class RegistryUnauthorizedError extends RegistryError {
  readonly url: string;

  constructor(url: string, options?: RegistryErrorOptions) {
    super(`You are not authorized to access the item at ${url}.`, options);
    this.url = url;
  }
}

export class RegistryForbiddenError extends RegistryError {
  readonly url: string;

  constructor(url: string, options?: RegistryErrorOptions) {
    super(`Access to the item at ${url} is forbidden.`, options);
    this.url = url;
  }
}

export class RegistryFetchError extends RegistryError {
  readonly url: string;
  readonly status?: number;

  constructor(url: string, status?: number, options?: RegistryErrorOptions) {
    super(`Failed to fetch the item at ${url}${status ? ` (HTTP ${status})` : ""}.`, options);
    this.url = url;
    this.status = status;
  }
}

export class RegistryParseError extends RegistryError {
  readonly url: string;

  constructor(url: string, cause: unknown) {
    super(`The item at ${url} is not a valid registry item.`, { cause });
    this.url = url;
  }
}

export class RegistryNotConfiguredError extends RegistryError {
  readonly registry: string;

  constructor(registry: string) {
    super(`Unknown registry "${registry}". Add it to the "registries" field in components.json.`);
    this.registry = registry;
  }
}
