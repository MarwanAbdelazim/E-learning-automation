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
Runs headless with no manual input. Tests that need a verified account or the SMS OTP skip with a clear
reason until `TEST_USER_*` / `TEST_MOBILE` + `TEST_OTP` are set (see below). `RECORD_VIDEO=true npm test`
records every scenario.

## Configuration (`.env`, all optional — see `.env.example`)
| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | staging URL | Site under test |
| `LOGIN_PATH` / `SIGNUP_PATH` | `/login` / `/register` | Auth routes |
| `LANGUAGE` | `ar` | UI language for the default project |
| `TEST_USER_LOGIN` / `TEST_USER_PASSWORD` | – | Verified account (username, email or phone) for positive login tests |
| `TEST_MOBILE` / `TEST_OTP` | – | Staging test number + bypass OTP to run sign-up past mobile verification |
| `RECORD_VIDEO` | `false` | `true` records video for every test |
| `HEADLESS` | `true` | `false` to watch the browser |

## Structure
```
src/
  config/env.ts          environment + paths
  data/userFactory.ts    unique test users & invalid data
  data/accounts.ts       verified account lookup + skip reasons
  fixtures/index.ts      fixtures: page objects, account, language, popup handler, tracker blocking
  pages/                 Page Object Model (BasePage, Header, Login, Signup, AR/EN text matchers)
tests/
  auth.setup.ts          logs in with the verified account and saves the session
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
