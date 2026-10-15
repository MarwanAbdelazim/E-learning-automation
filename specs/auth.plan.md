# Ednuva – Authentication Test Plan (Step 1)

Target: `BASE_URL` (default `https://stage.ednuva-website-8tf.pages.dev`)
Seed: `tests/seed.spec.ts`

## Sign up — `tests/auth/signup.spec.ts`
| # | Scenario | Expected |
|---|----------|----------|
| SU-01 | Open sign-up page | Email, password (masked) and submit button are visible |
| SU-02 | Register with a unique generated user | User is signed in, redirected to login, or asked to verify email |
| SU-03 | Register with an already registered email | Form rejected with an "already exists" style error |
| SU-04 | Malformed emails (`plainaddress`, `missing-at.com`, `user@`, `@no-user.com`) | Email field flagged invalid |
| SU-05 | Submit empty form | Required-field validation shown |
| SU-06 | Weak password (`123`) | Password field flagged invalid |
| SU-07 | Mismatched confirm password | Confirm field flagged invalid (skipped if no confirm field) |
| SU-08 | Navigate to login from sign-up | Login form is displayed |

## Login — `tests/auth/login.spec.ts`
| # | Scenario | Expected |
|---|----------|----------|
| LI-01 | Open login page | Email/phone, masked password and enabled submit button visible |
| LI-02 | Valid credentials | Leaves login page, header shows signed-in state |
| LI-03 | Reload after login | Session persists |
| LI-04 | Logout | Header shows login link again |
| LI-05 | Wrong password | Stays on login with an error |
| LI-06 | Unregistered email | Stays on login with an error |
| LI-07 | Empty credentials | Required-field validation shown |
| LI-08 | Malformed email | Validation error shown |
| LI-09 | Links | Sign-up and forgot-password links visible |
| LI-10 | Saved session (`.auth/storage-state.json`) | Home page opens already signed in |

## Test data
No manual input: `tests/auth.setup.ts` signs up a generated user (`src/data/userFactory.ts`),
stores it in `.auth/user.json` and saves the session. Set `TEST_USER_EMAIL` / `TEST_USER_PASSWORD`
to use an existing account instead (needed if sign-up requires email/OTP verification).
