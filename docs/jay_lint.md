# jay_lint: my personal linter

Notes for future me on the linter I built: why it exists, what it can do, how it works and
how it grew. Written for `jay_lint` 0.2.0 (October 2026).

| | |
| --- | --- |
| Name | `jay_lint` (PyPI), command `jlint` (also `jay_lint`) |
| Source | <https://github.com/ZJay07/jay_lint> (MIT licence) |
| Install | `pip install jay_lint` |
| Languages | Python, TypeScript, JavaScript (`.ts .tsx .js .jsx .mjs .cjs .mts .cts`) |
| Built with | Python, the `ast` module, [tree-sitter](https://tree-sitter.github.io/), [Please](https://please.build) for builds and tests |

- [Why I built it](#why-i-built-it)
- [Features](#features)
- [How it works](#how-it-works)
- [How it grew](#how-it-grew)
- [Tests and quality](#tests-and-quality)
- [Using it](#using-it)
- [Where this website uses it](#where-this-website-uses-it)
- [Releasing a new version](#releasing-a-new-version)
- [Gotchas I hit](#gotchas-i-hit)
- [Limitations and ideas](#limitations-and-ideas)

## Why I built it

It started in July 2024 as, in the README's words, "my attempt in making my own linter" using
Python's `ast` library and Please from Thought Machine. It was a way to learn how linters
actually work (parsing source into a tree, writing rules, and fixing code automatically) and
to build a real tool with a proper build system and CI instead of a one-off script.

In October 2026 I brought it to this website. ESLint's `max-len` rule was producing 44
warnings, almost all from long strings, and I wanted my own tool checking my own code. That
led to TypeScript and JavaScript support, a config file, and a proper release process.

## Features

### Python

| Check | `--fix` |
| --- | --- |
| Unused imports | removes them |
| Unused function arguments | removes them |
| Unused variables | removes them (and their use in simple `return` expressions) |
| Import order (checked alphabetically) | reorders into standard library, third party and local groups |
| Trailing whitespace, empty first line, extra blank lines | fixes |
| Blank lines between functions; no blank line before `return` | fixes |
| Naming conventions (methods in lower camel case, classes in upper camel case) | |
| Missing comment above a function | |
| Line length (100) | |

### TypeScript and JavaScript

| Check | `--fix` |
| --- | --- |
| **Import order and grouping:** built-ins, external, internal (`@/...`), parent (`../`), sibling (`./`), index; alphabetical within a group, ignoring case; one blank line between groups and none inside one | reorders |
| **Unused imports:** default, named, aliased and namespace imports. Side-effect imports (`import './x.css'`) are never reported | removes them |
| **Whitespace:** trailing whitespace, repeated or leading blank lines, missing or extra final newline | fixes |
| **Line length:** whole-line `//` comments and ` * ` JSDoc lines are reported and **wrapped** by `--fix`. Lines with strings, template literals, regexes, URLs, trailing comments, tool directives (`eslint-...`, `@ts-...`, `prettier-ignore`) or aligned columns are not reported. Long JSX text is reported but not fixed | wraps comments |

The import rules mirror `eslint-plugin-import`'s `import/order` with `alphabetize` and
`newlines-between: always`, so jlint and ESLint agree instead of undoing each other.

### The tool itself

- **Config file:** `jlint.toml` (or `[tool.jlint]` in `pyproject.toml`) with `paths`, `exclude`,
  `max-line-length` and `strict`. Plain `jlint` then lints the configured paths. It is found by
  searching upwards from the current folder; `--config` picks a file. Command-line arguments
  override the config. Mistakes in the config give a clear error.
- **CLI:** takes several files or whole folders (skipping `node_modules`, `.next`, `plz-out`,
  `dist`, `build`, and similar), `--fix`, `--strict` (exit 1 if anything is reported, for CI)
  and `--max-line-length`.
- **Safe fixing:** CRLF files stay CRLF; imports are only reordered when nothing but imports
  sits between them; a comment between two imports leaves them alone; fixing twice gives the
  same result.
- **Easy install:** one `pip install`; TypeScript support comes with it (Python 3.9+).

## How it works

```
src/cli.py                      command line, finds files, runs the right linter
src/config.py                   reads and validates jlint.toml / [tool.jlint]
src/lexing/logic/lexing.py      Python linter (ast + tokenize)
src/lexing/logic/ts_linter.py   TypeScript / JavaScript linter (tree-sitter)
```

- **Python** is parsed with `ast`. Comments are found with `tokenize`, since `ast` drops them.
- **TypeScript** is parsed with tree-sitter (the TSX grammar for `.tsx/.js/.jsx`, the TypeScript
  grammar for `.ts`). A real syntax tree makes unused-import detection and "is this inside a
  string or comment?" reliable, which regexes are not.
- **Unused imports (TS):** collect every name an import creates, collect every identifier used
  outside import statements (JSX tags, type names and `export { x }` count), and report the
  difference.
- **Import order (TS):** each import gets a group and a case-insensitive, segment-by-segment sort
  key. The checker reports `'@/utils/motion' import should occur before import of './x'`, and
  the fixer rebuilds the import block from the original statement text.
- **Fixing (TS)** works as text edits on byte ranges, then re-parses. The order is: remove unused
  imports, sort imports, wrap long comments, clean whitespace.
- **Comment wrapping** is a greedy word wrap that keeps the indent and `//` or ` * ` prefix. A
  word longer than the limit gets a line of its own.
- **Config** is TOML (`tomllib`, or `tomli` on Python below 3.11).

## How it grew

| When | What |
| --- | --- |
| Jul 2024 | Started, built with Please from day one. Function comments, import order, trailing whitespace, unused args and imports, empty lines, naming conventions, a line-length check |
| Jul 2024 | `--fix`: removing unused code, reordering imports |
| Aug 2024 | GitHub Actions running the Please tests, blank-line and `return` rules, packaging with Poetry, first PyPI releases (0.0.1 and 0.0.2 on 8 Aug) |
| Oct 2024 | 0.0.3 on PyPI |
| Oct 2026 | **0.1.0:** TypeScript and JavaScript support, the `jlint` command, and a packaging fix (the 0.0.3 wheel shipped only `cli.py`, so its command could not run). TypeScript support is part of the default install |
| Oct 2026 | CI pinned to Python 3.11 through `uv`, because Please's test runner broke on Python 3.12 |
| Oct 2026 | **0.2.0:** config file and long-comment wrapping with `--fix` |
| Oct 2026 | `scripts/release.sh` to build, check and publish |

## Tests and quality

- 153 tests: unittest-style, all passing under Please (13 test targets) and plain `pytest`.
- The TypeScript work was written test-first (red, green, refactor).
- Tests run in GitHub Actions on every PR. Python is pinned to 3.11 for Please via `uv`
  (`.python-version` and `scripts/use_uv_python.sh`), because Please's bundled test runner
  breaks on Python 3.12.
- A real-code check: on the commit that once broke the Vercel build, jlint reports exactly the
  import-order errors Vercel reported (`Bio.tsx` line 7, `Contact.tsx` line 8,
  `Experience.tsx` line 19), and it found 3 genuinely unused imports in `Experience.tsx` that
  ESLint missed (`no-unused-vars` is not enabled).

## Using it

```bash
pip install jay_lint

jlint file.py                     # one file
jlint app components              # folders
jlint --fix components/Bio.tsx    # fix in place (always read `git diff` after)
jlint                             # no arguments: use `paths` from jlint.toml
jlint --strict --max-line-length 88 app   # exit 1 if anything is reported
```

```toml
# jlint.toml
paths = ["app", "components", "lib", "utils"]
max-line-length = 88
strict = true
exclude = ["generated"]
```

## Where this website uses it

- `jlint.toml` at the project root holds the settings above.
- `npm run check` runs ESLint, Prettier, **jlint** and `tsc`, read-only. GitHub Actions runs it
  through `plz check`. `npm run fix` runs ESLint `--fix`, `jlint --fix` and Prettier.
- ESLint's `max-len` is switched off, since jlint owns line length.
- CI and the Docker image install `jay_lint==0.2.0`. Vercel's build only runs `tsc` and
  `next lint`, so it needs no Python.
- The commands for this project are in the main [README](../README.md).

## Releasing a new version

Done in the `jay_lint` repo.

1. Change the code test-first and run the tests (`plz test //src/...` or `pytest`).
2. `main` is protected: open a PR, merge once CI is green. Bump `version` in `pyproject.toml`
   in that PR.
3. Tag the merge commit: `git tag -a vX.Y.Z -m "..." && git push origin vX.Y.Z`.
4. From `main`: `./scripts/release.sh --dry-run`, then `./scripts/release.sh`. It checks the
   branch, a clean working tree, sync with `origin/main`, the tag, that the package files
   match the tag and that the version is not on PyPI yet. It builds, runs `twine check` and
   asks before uploading. Twine takes `__token__` and a PyPI API token as credentials.
5. Update the pinned version in this website (`type_check.yml`, `Dockerfile`, README).

A published version can never be re-uploaded or changed. Publish a new version instead.

## Gotchas I hit

- **PyPI lag:** a version is not visible to `pip` for a few minutes after upload. CI started
  three minutes after the 0.2.0 upload and failed at `pip install`. Re-run the job.
- **Please and Python 3.12:** Please ignores the `python3` on `PATH`; it needs the interpreter
  path in `.plzconfig.local` (what `scripts/use_uv_python.sh` writes).
- **Windows line endings:** with `core.autocrlf=true`, files are CRLF on disk. WSL git then sees
  every file as modified, and `sed` can fail to read `pyproject.toml`. The release script handles
  both; `.gitattributes` keeps shell scripts and Please files as LF.
- **Autofix under WSL:** ESLint's import resolver failed against a Windows-built `node_modules`
  and an autofix reordered imports wrongly, which broke a Vercel build. Always read the diff
  after any `--fix`, and run Linux tools against a Linux install.

## Limitations and ideas

- Long strings, `className` values and trailing comments are never reported and cannot be
  fixed automatically; Prettier does not split them either.
- Long JSX text is reported but not fixed.
- `jlint` prints "No issues found" per file, which is noisy in `npm run check`. A `--quiet`
  flag would help.
- The Python line length is fixed at 100 and the Python checks have no config keys yet.
- Ideas: `--quiet`, config for the Python checks, grouping of `import type`, more languages.
