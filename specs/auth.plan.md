# Ednuva – Authentication Test Plan (Step 1)

Target: `BASE_URL` (default `https://stage.ednuva-website-8tf.pages.dev`), API `api.stg.ednuva.com`.
Languages: Arabic (default, project `chromium-ar`) and English (`chromium-en`, tests tagged `@i18n`).

## Login — `/login` — `tests/auth/login.spec.ts`
| ID | Scenario | Expected | Needs |
|----|----------|----------|-------|
| LI-01 | Open login page | Identifier + masked password, forgot-password, create-account, login button | – |
| LI-02 | Fill fields one by one | Login button disabled until both fields filled | – |
| LI-03 | Unknown username | Toast "البيانات الانت مدخلها مش متطابقة…" / "These credentials do not match our records." | – |
| LI-04 | Unknown email | Same error toast, stays on /login | – |
| LI-05 | Unknown phone | Same error toast, stays on /login | – |
| LI-06 | Real account, wrong password | Same error toast | account |
| LI-07 | Eye button | Password toggles text ↔ password, value kept | – |
| LI-08 | Forgot password link | Opens /forgot-password | – |
| LI-09 | Create account link | Opens /register account-type step | – |
| LI-10 | Valid credentials | Leaves /login, header shows signed-in state | account |
| LI-11 | Reload after login | Session persists | account |
| LI-12 | Header login / sign-up links | Open the login and sign-up pages | – |
| LI-13 | Saved session | Home opens signed in | account |

## Sign up — `/register` — `tests/auth/signup.spec.ts`
| ID | Scenario | Expected | Needs |
|----|----------|----------|-------|
| SU-01 | Open sign-up | School and university account types offered | – |
| SU-02 | Pick type + continue | School → "Step 1 of 4", University → "Step 1 of 3" | – |
| SU-03 | Back from step 1 | Returns to account type | – |
| SU-04 | "Already have an account" link | Opens /login | – |
| SU-05 | Step 1 fields | Full name, gender, username, national ID, email, mobile, WhatsApp, password ×2, governorate, city, password rule hint | – |
| SU-06 | Empty step 1 | Continue disabled | – |
| SU-07 | Non-Arabic full name (3 samples) | Inline error "دخل حروف عربية بس." / "Please enter Arabic letters only." | – |
| SU-08 | Arabic full name | Accepted | – |
| SU-09 | Governorate → city | City locked until governorate chosen, then options load | – |
| SU-10 | Governorate search | Filters list; no match → empty | – |
| SU-11 | Eye button | Password toggles visibility | – |
| SU-12 | Test data | Generated passwords match site rule (6–20, letters/digits/_ . -) | – |
| SU-13 | Verify with empty/short mobile | No OTP sent, continue stays disabled | – |
| SU-14 | All fields valid, mobile not verified | Continue disabled | – |
| SU-15 | Verify mobile with OTP, continue | Reaches step 2 | TEST_MOBILE + TEST_OTP |
| SU-16 | Invalid mobile + Verify | Error shown — **known bug BUG-02** (`test.fail`) | – |
| SU-17 | Letters typed in mobile | Ignored — **known bug BUG-03** (`test.fail`) | – |

## Known site issues found by automation
| ID | Issue |
|----|-------|
| BUG-01 | Network/API failure on login is shown as "wrong username or password". |
| BUG-02 | "Verify" on an empty/short mobile silently does nothing (no request, no message). |
| BUG-03 | Mobile and WhatsApp inputs accept letters. |
| BUG-04 | Arabic login error copy typo: "البيانات **الانت** مدخلها" → "البيانات **اللي انت** مدخلها". |
| BUG-05 | Only full name has inline validation on blur; malformed email, short mobile, short national ID and mismatched confirm password show nothing. |
| BUG-06 | A test announcement ("أختبار", 1 of 3) pops up on the staging home page. |

## Blocked: full sign-up and positive login
Mobile verification sends a real SMS OTP. Setting `TEST_MOBILE` + `TEST_OTP` (staging test number and bypass
code) enables SU-15; a verified `TEST_USER_LOGIN`/`TEST_USER_PASSWORD` enables LI-06, LI-10, LI-11, LI-13.
