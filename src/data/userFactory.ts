import { faker } from '@faker-js/faker';
import { env } from '../config/env';

export interface TestUser {
  fullName: string;
  username: string;
  email: string;
  /** Local Egyptian mobile without the +20 country code, e.g. 1012345678 */
  mobile: string;
  whatsapp: string;
  password: string;
  gender: 'male' | 'female';
}

const ARABIC_FIRST = ['محمد', 'أحمد', 'محمود', 'مصطفى', 'عمر', 'يوسف', 'كريم', 'مريم', 'سارة', 'نور', 'ليلى', 'هدى'];
const ARABIC_LAST = ['حسن', 'علي', 'إبراهيم', 'عبدالعزيز', 'السيد', 'الجمال', 'منصور', 'سليمان', 'فؤاد', 'رمضان'];

/** Site rule: 6–20 characters, letters, digits and `_ . -` only. */
export const PASSWORD_RULE = /^[A-Za-z0-9_.-]{6,20}$/;

/**
 * Builds a unique user that satisfies the site's client-side rules
 * (Arabic-only full name, password policy, Egyptian mobile format).
 * The mobile number is the configured test number when available, so tests never
 * send verification SMS to a random real person.
 */
export function createUser(overrides: Partial<TestUser> = {}): TestUser {
  const unique = `${Date.now().toString(36)}${faker.string.alphanumeric({ length: 3, casing: 'lower' })}`;
  const mobile = env.testMobile.replace(/^\+?20/, '').replace(/^0/, '') || `10${faker.string.numeric(8)}`;
  return {
    fullName: `${faker.helpers.arrayElement(ARABIC_FIRST)} ${faker.helpers.arrayElement(ARABIC_LAST)} ${faker.helpers.arrayElement(ARABIC_LAST)}`,
    username: `qa_${unique}`.slice(0, 20),
    email: `qa.${unique}@mailinator.com`,
    mobile,
    whatsapp: mobile,
    password: `Qa_${faker.string.alphanumeric(6)}.${faker.string.numeric(2)}`,
    gender: faker.helpers.arrayElement(['male', 'female'] as const),
    ...overrides,
  };
}

export const invalidData = {
  nonArabicNames: ['Ahmed Ali', 'John', 'محمد Ali'],
  /** Violate the password rule: too short, illegal symbol, too long. */
  badPasswords: ['ab1', 'abc!123', 'a'.repeat(21)],
  wrongPassword: 'Wrong_Pass99',
  unknownLogin: () => `nobody_${Date.now().toString(36)}`,
};
