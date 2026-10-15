# Ednuva E2E Automation

Playwright + TypeScript end-to-end framework for the [Ednuva](https://stage.ednuva-website-8tf.pages.dev)
e-learning website, set up for **agentic execution** with Playwright MCP.

## Quick start
```bash
npm install
npx playwright install chromium
npm test            # setup (auto sign-up) + all tests
npm run report      # open the HTML report
```
No manual input is required: the `setup` project signs up a generated user, saves it to
`.auth/user.json` and stores the signed-in session in `.auth/storage-state.json`. Later runs reuse it.

## Configuration (`.env`, all optional — see `.env.example`)
| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | staging URL | Site under test |
| `LOGIN_PATH` / `SIGNUP_PATH` | `/login` / `/signup` | Auth routes |
| `TEST_USER_EMAIL` / `TEST_USER_PASSWORD` | – | Use an existing account instead of auto sign-up |
| `TEST_EMAIL_DOMAIN` | `mailinator.com` | Domain for generated emails |
| `HEADLESS` | `true` | `false` to watch the browser |

## Structure
```
src/
  config/env.ts          environment + paths
  data/userFactory.ts    unique test users & invalid data
  fixtures/index.ts      test fixtures (page objects, registeredUser)
  pages/                 Page Object Model (BasePage, Header, Login, Signup, text matchers)
  utils/userStore.ts     persists the generated account
tests/
  auth.setup.ts          creates/reuses the account, saves session
  auth/login.spec.ts     login scenarios
  auth/signup.spec.ts    sign-up scenarios
  seed.spec.ts           seed for Playwright Test Agents
specs/auth.plan.md       test plan (step 1: login & sign-up)
.claude/agents/          Playwright planner / generator / healer agents
.mcp.json                Playwright MCP servers
.github/workflows/e2e.yml CI (push, PR, nightly, manual)
```

## Agentic workflow
With Claude Code in this repo, the MCP servers in `.mcp.json` load automatically. Ask for the next step
(e.g. *"plan and generate tests for the course catalog"*) and the planner → generator → healer agents
explore the live site, write the specs, run them and fix failures. See `CLAUDE.md`.

## Roadmap
1. ✅ Login & sign-up
2. Course catalog (browse, search, filter, course details)
3. Enrollment & learning (lessons, progress)
4. Instructors (profiles, reviews, booking)
