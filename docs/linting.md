# Linting, formatting and the personal linter (jlint)

Reference for how code quality is checked in this project, and for `jay_lint`, the personal
linter that is part of that setup. Last updated for `jay_lint` 0.2.0.

- [The big picture](#the-big-picture)
- [jay_lint: what it is](#jay_lint-what-it-is)
- [What it checks and fixes](#what-it-checks-and-fixes)
- [Configuration (`jlint.toml`)](#configuration-jlinttoml)
- [How it is wired into this project](#how-it-is-wired-into-this-project)
- [Day-to-day commands](#day-to-day-commands)
- [Releasing a new jay_lint version](#releasing-a-new-jay_lint-version)
- [Why it is built this way](#why-it-is-built-this-way)
- [Troubleshooting](#troubleshooting)
- [Known limitations and ideas](#known-limitations-and-ideas)

## The big picture

Four checks guard the code. `npm run check` runs all four, read-only, in this order:

| Check | Tool | What it covers |
| --- | --- | --- |
| Lint | ESLint (`next lint`) | React and Next rules, `import/order`, a few others |
| Formatting | Prettier (`--check`) | Code style: quotes, commas, wrapping at 80 columns |
| Personal linter | `jlint` | Import order, unused imports, whitespace, line length |
| Types | `tsc --noEmit` | TypeScript errors |

Where each one runs:

| Where | What runs |
| --- | --- |
| Your machine | `npm run check`, `npm run fix`, `npm run push` |
| GitHub Actions (every push and PR) | `bash ./pleasew check`, which runs `npm run check` |
| Vercel build | `prebuild` = `tsc` then `next lint` only. No Python, no Prettier, no jlint |

A failing check on Vercel blocks the deploy, so ESLint errors (for example `import/order`)
must be fixed before pushing even though jlint and Prettier do not run there.

## jay_lint: what it is

- A personal linter written in Python, published on PyPI as **`jay_lint`**.
  Source: <https://github.com/ZJay07/jay_lint>.
- Two commands are installed, `jlint` and `jay_lint`; they are the same program.
- **Python files:** parsed with Python's `ast` module (works on Python 3.7+).
- **TypeScript and JavaScript files** (`.ts .tsx .js .jsx .mjs .cjs .mts .cts`): parsed with
  [tree-sitter](https://tree-sitter.github.io/) using the TypeScript and TSX grammars. This
  needs **Python 3.9+** and is installed automatically with the package.
- Install: `pip install jay_lint` (this project pins `jay_lint==0.2.0` in CI and Docker).

## What it checks and fixes

For TypeScript and JavaScript (the part this website uses). `--fix` fixes the rows marked *fix*:

| Check | `--fix` |
| --- | --- |
| **Import order and grouping.** Groups in this order: Node built-ins, external packages, internal (`@/...`), parent (`../`), sibling (`./`), index. Alphabetical within a group, ignoring case. One blank line between groups, none inside a group | *fix* (reorders) |
| **Unused imports.** Default, named, aliased and namespace imports. Side-effect imports (`import './globals.css'`) are never reported | *fix* (removes) |
| **Whitespace.** Trailing whitespace, repeated or leading blank lines, missing or extra final newline | *fix* |
| **Line length** (88 here, from `jlint.toml`). See the rules below | *fix* for comments only |

Line length rules:

- Reported and wrapped by `--fix`: whole-line `//` comments, and ` * ` lines inside `/** */` blocks.
  Wrapping breaks at word boundaries and keeps the indent and comment prefix.
- Never reported (they cannot be wrapped safely): lines containing a string, template literal,
  regex or URL; trailing comments after code; tool directives (`eslint-...`, `@ts-...`,
  `prettier-ignore`, `jlint`); `///` triple-slash lines; comments with aligned columns.
- JSX text that is too long **is** reported, and `--fix` cannot fix it.

Import fixing is cautious: imports are only reordered when nothing but imports sits between
them. A comment between two imports leaves that block alone. Side-effect imports split the
imports into separate sorted runs. Line endings (LF or CRLF) are preserved.

The import rules mirror `eslint-plugin-import`'s `import/order` with `alphabetize` and
`newlines-between: always`, which is what `.eslintrc.js` enforces, so the two never fight.

For Python files the checks are: unused imports, import order, trailing whitespace and blank
lines, unused function arguments and variables, naming conventions, missing function
comments, and line length (100). `--fix` handles the fixable ones.

## Configuration (`jlint.toml`)

Settings live in `jlint.toml` at the project root, so the command is just `jlint`:

```toml
paths = ["app", "components", "lib", "utils"]
max-line-length = 88
strict = true
```

| Setting | Meaning |
| --- | --- |
| `paths` | Files or folders linted when none are given on the command line |
| `exclude` | Folder names, file names or paths to skip inside folders (globs allowed) |
| `max-line-length` | Line length for TypeScript and JavaScript (default 100) |
| `strict` | Exit with status 1 if anything is reported (needed for CI) |

How the config is found and applied:

- `jlint` searches upwards from the current folder for `jlint.toml`, or a `[tool.jlint]` table
  in `pyproject.toml` (`jlint.toml` wins). `--config path/to/file.toml` picks a file explicitly.
- `paths` and `exclude` are relative to the config file.
- Command-line arguments override the config. Files on the command line replace `paths`;
  `--max-line-length` replaces `max-line-length`.
- Unknown keys, wrong types and invalid TOML print an error and exit with status 2.
- Folders such as `node_modules`, `.next`, `plz-out`, `dist` and `build` are always skipped.

## How it is wired into this project

- **`jlint.toml`** holds the settings above.
- **`package.json` scripts**
  - `check`: `npm run lint && npm run format:check && npm run jlint && npm run type-check`
  - `jlint`: plain `jlint`
  - `fix`: `next lint --fix && jlint --fix && prettier --write ...`
  - `push`: runs `scripts/push.sh` (check, commit what is staged, push; never force-pushes)
- **`.eslintrc.js`**: `max-len` is **off**. jlint owns line length.
- **`.github/workflows/type_check.yml`**: Node 20, Python 3.11, `pip install jay_lint==0.2.0`,
  then `bash ./pleasew check`.
- **Please (`plz`)**: `.plzconfig` pins Please 17.33.0 and defines `plz check` (read-only),
  `plz lint` (same) and `plz lint --fix`. `BUILD.plz` and `scripts/lint.sh` just call the npm
  scripts. Please only runs on Linux or macOS, so on Windows use WSL or Docker.
- **Docker** (`Dockerfile`, `compose.yaml`): a Linux image with Node and `jay_lint` installed, so
  `plz` runs with Linux `node_modules` kept in a Docker volume.
  `docker compose run --rm plz check` and `docker compose run --rm plz lint --fix`.

## Day-to-day commands

```bash
npm run check                 # everything, read-only (what CI runs)
npm run fix                   # fix what can be fixed, then review `git diff`
jlint                         # just the personal linter
jlint --fix                   # fix import order, unused imports, whitespace, long comments
jlint components/Bio.tsx      # one file (overrides `paths`)
npm run push -- -m "message"  # check, commit staged files, push
```

Always read `git diff` after any `--fix`. One earlier autofix reordered imports wrongly (see
[Why it is built this way](#why-it-is-built-this-way)).

Requirements on your machine: Node 20, and Python 3.9+ with `pip install jay_lint`.

## Releasing a new jay_lint version

All of this happens in the `jay_lint` repository, not this one.

1. Make the change test-first. Tests run with `plz test //src/...` (Python pinned to 3.11 via
   `uv` and `.python-version`) or plain `pytest`.
2. `main` is protected: open a pull request and merge it once CI is green.
3. Bump `version` in `pyproject.toml` (in the same PR).
4. After the merge, tag the merge commit: `git tag -a vX.Y.Z -m "..." && git push origin vX.Y.Z`.
5. Publish from `main`: `./scripts/release.sh --dry-run`, then `./scripts/release.sh`. It checks
   that you are on a clean, up-to-date `main`, that the tag exists and the package files match
   it, and that the version is not already on PyPI; then it builds, runs `twine check` and
   asks before uploading. Twine asks for the username `__token__` and your PyPI API token
   (pypi.org, Account settings, API tokens). A version can never be re-uploaded.
6. Update the pin in this repo (`type_check.yml`, `Dockerfile`, and the README if it names a
   version) and push.

## Why it is built this way

- **Why a personal linter at all:** a hands-on project covering parsing, rule design and
  auto-fixing. It also removed ESLint's noisy `max-len` warnings (long strings and
  `className` values) while keeping a real line-length check.
- **Why tree-sitter for TypeScript:** it gives a real syntax tree from Python, needs no Node,
  and ships prebuilt wheels. That makes unused-import detection and string/comment awareness
  reliable, which regexes are not.
- **Why the import rules mirror ESLint:** a Vercel build once failed because an autofix reordered
  `./SectionWrapper` above `@/utils/motion`. It had been run under WSL against a
  Windows-built `node_modules`, so ESLint's import resolver could not load and it classified the
  imports wrongly. jlint reproduces the exact errors Vercel reported for that commit, and a
  jlint check on the correct order passes.
- **Why Python 3.11 is pinned for `jay_lint` CI:** Please's bundled test runner breaks on
  Python 3.12. The fix was to point Please at a `uv`-managed 3.11 through
  `scripts/use_uv_python.sh`, which writes an untracked `.plzconfig.local`.
- **Why `max-len` is off in ESLint:** jlint exempts strings, URLs and directives and can wrap
  comments. Keeping both would double-report.

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `jlint: command not found` / `npm run check` fails at the jlint step | `pip install jay_lint` (Python 3.9+), and make sure Python's `Scripts` (Windows) or `bin` folder is on `PATH` |
| `needs Python 3.9 or newer` message for `.ts` files | Python is older than 3.9; upgrade Python |
| CI fails at `pip install jay_lint==X.Y.Z` just after a release | PyPI's index takes a few minutes to show a new version. Re-run the job later |
| Release script says `you have uncommitted changes` from WSL | WSL git sees Windows (CRLF) checkouts as modified. Fixed in the script; otherwise run `git config core.autocrlf true` in that repo, or run from Git Bash |
| `/bin/sh^M: bad interpreter` | A shell script has Windows line endings. `.gitattributes` keeps `*.sh` as LF; re-checkout the file |
| `plz` works in CI but not on Windows | Please has no native Windows build: use WSL or `docker compose run --rm plz ...` |
| ESLint `Failed to load native binding` under WSL | The Windows `node_modules` has Windows binaries. Run `plz` through Docker, or reinstall in a Linux checkout |
| Docker commands fail with an engine error | Start Docker Desktop and wait for "Engine running" |

## Known limitations and ideas

- Long strings, `className` values and trailing comments are never reported and cannot be
  auto-fixed. Prettier does not split them either.
- JSX text that is too long is reported but not fixed.
- `jlint` prints a header and "No issues found" for every file, which is noisy inside
  `npm run check`. A `--quiet` flag is an idea for a later release.
- The Python linter's line length is fixed at 100; there is no config key for it yet.
- Possible additions: more import styles (`import type` grouping), `--quiet`, a config key for
  Python checks, and a CSS or Markdown mode.
