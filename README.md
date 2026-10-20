This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Lint, format and check

The same checks run locally, in GitHub Actions and on Vercel's build: ESLint,
Prettier (check only) and `tsc`.

### With npm (Windows, macOS or Linux)

```bash
npm run check          # read-only: ESLint, Prettier check, tsc
npm run fix            # edits files: eslint --fix and prettier --write
npm run push -- -m "message"   # runs check, commits what is staged, pushes
```

`push` only commits files you already staged with `git add`, and never
force-pushes.

### With Please (Docker)

`plz` ([please.build](https://please.build)) only runs on Linux, so it runs in a
container with its own Linux `node_modules`. Docker Desktop must be running.
Every command is a single step; there is no shell to enter first:

```bash
docker compose run --rm plz check        # read-only: ESLint, Prettier, tsc (same as CI)
docker compose run --rm plz lint         # same as check
docker compose run --rm plz lint --fix   # edits files in this folder
docker compose run --rm plz query alltargets   # any other plz command
```

Review `git diff` after `lint --fix` before committing.

The first run builds the image and installs dependencies (about a minute); later
runs only reinstall when `package-lock.json` changes.

| Command | Use it when |
| --- | --- |
| `docker compose build` | You changed `Dockerfile` or `scripts/docker-entrypoint.sh` |
| `docker compose down -v` | You want a clean slate (deletes the cached `node_modules`) |
| `docker compose run --rm --entrypoint bash plz` | You want a Linux shell in the container |

`plz push` needs your git credentials, which the container does not have. Use
`npm run push` or `bash scripts/push.sh -m "message"` on your own machine.
