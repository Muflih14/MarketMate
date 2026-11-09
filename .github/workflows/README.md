# market-mate workflows

Checks that run on pull requests to `develop`, `staging`, and `main`. Draft
pull requests are skipped. A new push to the same pull request cancels the
in-progress run.

| Workflow | Purpose |
| -------- | ------- |
| `test-lint.yml` | Pre-commit checks (formatting, Oxlint, Stylelint, actionlint, gitleaks) |
| `test-frontend.yml` | Install market-mate, run `pnpm test`, then `pnpm build` |

`test-frontend.yml` only runs when files under `market-mate/` or the frontend
workflow itself change. The lint workflow always runs.

Jobs use GitHub-hosted `ubuntu-latest` runners. Node is 24 and pnpm is 10,
matching the local toolchain.
