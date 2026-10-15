/**
 * Site copy for Arabic (default) and English, captured from the staging site.
 * Each matcher accepts both languages so page objects work in either locale.
 * When the site copy changes, fix it here first.
 */
const both = (ar: string, en: string, flags = 'i') => new RegExp(`^\\s*(?:${ar}|${en})\\s*\\*?\\s*$`, flags);

export const text = {
  // Header / navigation
  headerLogin: both('تسجيل الدخول', 'Log ?in|Login'),
  headerSignup: both('اعمل حساب جديد', 'Create (?:new )?account|Sign ?up'),
  languageToggle: both('تغيير اللغة', 'Change language'),

  // Login
  loginRegion: both('تسجيل الدخول', 'Authentication'),
  loginHeading: both('سجّل دخول لحسابك', 'Login to your account'),
  loginIdentifier: both('اسم المستخدم أو البريد أو الهاتف', 'Username, email,? or phone'),
  password: both('كلمة المرور', 'Password'),
  loginButton: both('تسجيل الدخول', 'Login'),
  showPassword: both('ورّي كلمة المرور', 'Show password'),
  hidePassword: /(اخفي|خبّي|إخفاء|hide).*(كلمة المرور|password)/i,
  forgotPassword: both('نسيت كلمة المرور؟', 'Forgot password\\?'),
  createAccount: both('اعمل حساب', 'Create account'),
  // API 400 message (AR text contains the site's own typo "الانت") and the client fallback used when the API is unreachable.
  invalidCredentials:
    /(البيانات الانت مدخلها مش متطابقة|البيانات اللي انت مدخلها مش متطابقة|اسم المستخدم أو كلمة المرور غلط|These credentials do not match our records)/i,

  // Sign-up: account type
  signupRegion: /^Signup form$/i,
  accountTypeHeading: both('اختار نوع حسابك', 'Choose your account type'),
  schoolStudent: /^(طالب مدرسة|High School Student)/i,
  universityStudent: /^(طالب جامعي|University Student)/i,
  continue: both('كمّل', 'Continue'),
  back: both('رجوع', 'Back'),
  haveAccountLogin: both('تسجيل الدخول', 'Log ?in'),

  // Sign-up: step 1 (account details)
  /** School track has 4 steps, university track has 3. */
  stepOf: (n: number, total: number | string = '\\d+') => new RegExp(`(الخطوة ${n} من ${total}|Step ${n} of ${total})`, 'i'),
  detailsHeading: both('بيانات حسابك', 'Your account details'),
  fullName: both('الاسم الكامل', 'Full name'),
  gender: both('النوع', 'Gender'),
  male: both('ذكر', 'Male'),
  female: both('أنثى', 'Female'),
  username: both('اسم المستخدم', 'Username'),
  nationalId: both('الرقم القومي \\(اختياري\\)', 'National ID'),
  email: both('البريد الإلكتروني', 'Email'),
  mobile: both('رقم الموبايل', 'Mobile number'),
  whatsapp: both('رقم الواتساب', 'WhatsApp number'),
  confirmPassword: both('أكد كلمة المرور', 'Confirm password'),
  governorate: both('المحافظة', 'Governate|Governorate'),
  governorateSearch: /(دوّر في المحافظات|Search)/i,
  city: both('المدينة', 'City'),
  verifyMobile: both('تأكيد الرقم', 'Verify'),
  otpInput: both('كود التأكيد', 'Verification code|OTP|Code'),
  confirmOtp: both('تأكيد الكود', 'Confirm code|Verify code'),
  otpSent: /(بعتنا كود في رسالة SMS|sent .*code|SMS)/i,
  arabicOnly: /(دخل حروف عربية بس|Please enter Arabic letters only)/i,
  passwordRule: /(من 6 إلى 20 حرفًا|6–20 characters)/i,
  closeDialog: both('اقفل', 'Close'),
  noResults: /(مفيش نتائج مطابقة|No (matching )?results)/i,
};
