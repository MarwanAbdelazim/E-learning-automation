/**
 * Bilingual (English / Arabic) text matchers used by the page objects.
 * Keeping them here means a copy change on the site is a one-line fix.
 */
export const text = {
  login: /^\s*(log\s?in|sign\s?in|تسجيل الدخول|دخول)\s*$/i,
  signup: /^\s*(sign\s?up|register|create (an )?account|join( now)?|get started|إنشاء حساب|انشاء حساب|تسجيل|اشترك)\s*$/i,
  logout: /(log\s?out|sign\s?out|تسجيل الخروج|خروج)/i,
  email: /(e-?mail|البريد)/i,
  emailOrPhone: /(e-?mail|phone|mobile|username|البريد|الهاتف|الجوال|رقم)/i,
  password: /^(?!.*confirm)(?!.*تأكيد).*(password|كلمة المرور|كلمة السر)/i,
  confirmPassword: /(confirm|re-?enter|repeat|تأكيد).*(password|كلمة)/i,
  firstName: /(first\s?name|الاسم الأول)/i,
  lastName: /(last\s?name|surname|family name|اسم العائلة|الاسم الأخير)/i,
  fullName: /^(full\s?name|name|your name|الاسم|الاسم بالكامل|الاسم الكامل)$/i,
  phone: /(phone|mobile|الهاتف|الجوال|رقم الموبايل)/i,
  terms: /(terms|agree|privacy|الشروط|أوافق|اوافق)/i,
  student: /^\s*(student|learner|طالب)\s*$/i,
  verification: /(verify|verification|otp|confirm your email|check your (email|inbox)|تحقق|تأكيد البريد|رمز)/i,
  errorHint:
    /(invalid|incorrect|wrong|required|not (be )?valid|doesn'?t match|do not match|must|already|exists|taken|failed|error|غير صحيح|خطأ|مطلوب|غير صالح|مستخدم بالفعل|موجود)/i,
};
