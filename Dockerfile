# syntax=docker/dockerfile:1

# Builds the docs site and serves it. Dokploy builds this image from the
# repository on every push to the deployed branch (build type: Dockerfile).
#
# One stage: the server is `vite preview`, which needs the same tooling the
# build does, so there is nothing to leave behind. The defaults are for a
# local `docker build`; keep PNPM_VERSION equal to `packageManager` in
# package.json, since pnpm manages its own version from that field and would
# otherwise download the other one.
ARG NODE_VERSION=24
ARG PNPM_VERSION=12.14.0

FROM node:${NODE_VERSION}-bookworm-slim
ARG PNPM_VERSION
RUN npm install -g pnpm@${PNPM_VERSION}

# lefthook's postinstall skips itself when CI is set. Without this it tries
# to write .git/hooks, which the image does not have.
ENV CI=1

WORKDIR /app

# Manifests first, so the dependency layer survives source-only changes.
# --frozen-lockfile fails the build if the lockfile is out of date rather
# than silently resolving something the repo never tested. Dependency build
# scripts are governed by `allowBuilds` in pnpm-workspace.yaml.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/docs/package.json apps/docs/
COPY packages/solid/package.json packages/solid/
COPY packages/cli/package.json packages/cli/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter ./apps/docs build

# Dokploy's Traefik routes to the container at 0.0.0.0:3000; vite preview
# defaults to localhost and to the port in the package script, so both flags
# are required here. The public host header is allowed by
# `preview.allowedHosts` in apps/docs/vite.config.ts.
EXPOSE 3000
CMD ["pnpm", "--filter", "./apps/docs", "exec", "vp", "preview", "--host", "0.0.0.0", "--port", "3000"]
