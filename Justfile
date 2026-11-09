# https://just.systems/man/en/introduction.html
# https://cheatography.com/linux-china/cheat-sheets/justfile/

# list all commands
default:
    just --list

# ------------------------------------------------------------------------------
# GIT Hook
# ------------------------------------------------------------------------------

# clean per-commit hook cache
[group('clean')]
[group('hook')]
clean-hook:
    pre-commit clean

# update pre-commit hooks
[group('hook')]
[group('update')]
update-hook:
    pre-commit autoupdate

# run pre-commit hook
[group('hook')]
[group('lint')]
lint-hook:
    pre-commit run --all-files

# ------------------------------------------------------------------------------
# market-mate
# ------------------------------------------------------------------------------

# install market-mate dependencies
[group('setup')]
install:
    cd market-mate && pnpm install

# run the market-mate dev server
[group('serve')]
serve:
    cd market-mate && pnpm dev

# build market-mate
[group('setup')]
build:
    cd market-mate && pnpm build

# format market-mate code
[group('lint')]
format:
    cd market-mate && pnpm lint:fix

# run market-mate linters
[group('lint')]
lint-app:
    cd market-mate && pnpm lint

# run market-mate tests
[group('test')]
test:
    cd market-mate && pnpm test

# update market-mate dependencies
[group('update')]
update-app:
    cd market-mate && pnpm update

# ------------------------------------------------------------------------------
# All
# ------------------------------------------------------------------------------

# update dependencies
[group('all')]
[group('update')]
update:
    just update-hook
    just update-app

# run all linters
[group('all')]
[group('lint')]
lint:
    just lint-hook
    just lint-app
