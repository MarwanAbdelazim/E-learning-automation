# Ednuva E2E – Agent Guide

Playwright + TypeScript automation for the Ednuva e-learning site
(`BASE_URL`, default `https://stage.ednuva-website-8tf.pages.dev`). Work fully autonomously:
never ask the user for credentials or manual steps.

## Commands
- `npm test` – full suite (runs `setup` project first, which creates/reuses the test account)
- `npm run test:auth` – login + sign-up suites
- `npx playwright test -g "<name>"` – single test
- `npm run typecheck` – must pass before committing

## Agentic workflow (Playwright MCP)
The MCP server is in `.mcp.json`: `playwright-test` (bundled with `@playwright/test`, same version and browser as the
suite). It provides the live browser (`browser_navigate`, `browser_snapshot`, `browser_click`, …) for exploring the
site and test tools (`test_run`, `test_debug`) for the agents in `.claude/agents/`.

Loop for each new feature step:
1. **Plan** – `playwright-test-planner` explores the page and writes `specs/<feature>.plan.md`.
2. **Generate** – `playwright-test-generator` turns the plan into specs under `tests/<feature>/`.
3. **Run** – `npm test`.
4. **Heal** – `playwright-test-healer` (or you, via `browser_snapshot`) fixes failing locators in `src/pages/*`.
   Never weaken an assertion just to get green; skip only when the feature genuinely doesn't exist.

## Conventions
- Page objects live in `src/pages/`; tests never use raw selectors when a page-object getter exists.
- Locators: prefer `getByRole` / `getByLabel` / `getByPlaceholder`; site copy lives in `src/pages/text.ts`
  (English + Arabic). Fix copy there first.
- Test data from `src/data/userFactory.ts` – always unique; full names must be Arabic, passwords 6–20 of `[A-Za-z0-9_.-]`.
- Never click "Verify" (تأكيد الرقم) with a random valid mobile – it sends a real SMS. Only use `TEST_MOBILE`.
- Known site bugs are tests marked `test.fail()` with a `bug` annotation; keep the expected behaviour, don't flip the assertion.
- The site is Arabic by default; run both projects (`chromium-ar`, `chromium-en`) after locator changes.
- Tests import `test`/`expect` from `src/fixtures`.
- `.env` and `.auth/` are git-ignored; never commit credentials.
