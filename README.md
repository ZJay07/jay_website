This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Lint and fix with Please (Docker)

`plz` only runs on Linux, so it runs in a container with its own `node_modules`.
Docker Desktop must be running. Each command is one step; there is no shell to
enter first:

```bash
docker compose run --rm plz check        # read-only: ESLint, Prettier, tsc
docker compose run --rm plz lint --fix   # edits files in this folder
```

The first run builds the image and installs dependencies (about a minute).
Rebuild with `docker compose build` after editing `Dockerfile` or
`scripts/docker-entrypoint.sh`.
