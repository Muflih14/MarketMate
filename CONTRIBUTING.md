# Contributing to market-mate

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- All features or bug fixes must be tested by one or more specs (unit-tests).
- All public API methods must be documented.
- Follow the code style rules defined for TypeScript and CSS.
  - The TypeScript code style is analyzed by
    [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) and
    [Oxlint](https://oxc.rs/docs/guide/usage/linter.html).
  - The CSS code style is analyzed by
    [stylelint](https://stylelint.io/).

## Naming conventions

### Names

Names are **self-explanatory**.

- Use **kebab-case** for file names.
- Use **PascalCase** for interface and type names.
- Do not use `I` as a prefix for interface names.
- Use **PascalCase** for enum values.
- Use **PascalCase** for class names.
- Use **PascalCase** for React component names.
- Use **camelCase** for function names.
- Use **camelCase** for property names and local variables.
- Use whole words in names when possible. Only use abbreviations where their use is common and obvious.

### Files

- Use the `.tsx` file extension for TypeScript files that contain React components.
- Use the `.ts` file extension for TypeScript files.
- Use the `.js` file extension for JavaScript files.

### Types

- Do not export types/functions unless you need to share it across multiple components.
- Do not introduce new types/values to the global namespace.
- Within a file, type definitions should come first.

## Commit message format

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Each commit message consists of a header, a body and an optional footer.
The header has a special format that includes a type, a scope, and a subject:

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

- Types of commit messages:
  - `build`: Changes that affect the build system or external dependencies
  - `ci`: Changes to CI configuration files and scripts
  - `docs`: Documentation only changes
  - `feat`: A new feature
  - `fix`: A bug fix
  - `perf`: A code change that improves performance
  - `refactor`: A code change that neither fixes a bug nor adds a feature
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc)
  - `test`: Adding missing tests or correcting existing tests
- Scope: The candidates for scope depends on the project and the technologies being used.
  It is fairly up to the developer to select a scope.
- Subject: The subject contains a succinct description of the change:
  - use the imperative, present tense: "change" not "changed" nor "changes"
  - don't capitalize the first letter
  - no dot/period (.) at the end
- Footer (Optional): Footer is used for citing issues that this commit closes (if any).

## PR approval workflow

1. Create the PR in **Draft** mode with a meaningful title.
2. Fill the PR template with the indicated information.
3. The PR branch **SHOULD** be up to date with the current base branch.
4. The developer might review their own PR as if they were the reviewer.
5. Fix the leftovers or any error found in the changes.
6. Set the PR status to **Ready**.
7. Wait for the GitHub Actions checks, if they fail then check the errors and fix them.
8. Once the GitHub Actions checks pass (green light).
