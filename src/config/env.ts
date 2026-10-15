import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

const trimSlash = (url: string) => url.replace(/\/+$/, '');

export type Language = 'ar' | 'en';

export const env = {
  baseUrl: trimSlash(process.env.BASE_URL || 'https://stage.ednuva-website-8tf.pages.dev'),
  loginPath: process.env.LOGIN_PATH || '/login',
  signupPath: process.env.SIGNUP_PATH || '/register',
  language: (process.env.LANGUAGE === 'en' ? 'en' : 'ar') as Language,
  testUserLogin: process.env.TEST_USER_LOGIN || '',
  testUserPassword: process.env.TEST_USER_PASSWORD || '',
  testMobile: process.env.TEST_MOBILE || '',
  testOtp: process.env.TEST_OTP || '',
  recordVideo: process.env.RECORD_VIDEO === 'true',
  headless: process.env.HEADLESS !== 'false',
  isCI: !!process.env.CI,
};

export const paths = {
  authDir: path.resolve(__dirname, '../../.auth'),
  storageState: path.resolve(__dirname, '../../.auth/storage-state.json'),
  userFile: path.resolve(__dirname, '../../.auth/user.json'),
};
