import { test as base, expect } from '@playwright/test';
import type { Language } from '../config/env';
import { loadAccount, MISSING_ACCOUNT, type Account } from '../data/accounts';
import { HeaderComponent } from '../pages/HeaderComponent';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import { text } from '../pages/text';

const THIRD_PARTY = /(googletagmanager\.com|google-analytics\.com|clarity\.ms|connect\.facebook\.net|facebook\.com\/tr)/;

export type FrameworkOptions = {
  /** UI language, applied before the app boots (the site reads it from localStorage). */
  language: Language;
};

type Fixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  header: HeaderComponent;
  /** Verified account; the test is skipped with a reason when none is configured. */
  account: Account;
};

export const test = base.extend<Fixtures & FrameworkOptions>({
  language: ['ar', { option: true }],

  page: async ({ page, language }, use) => {
    // Keep analytics/ads out of test runs: faster, deterministic, and no fake traffic in the site's metrics.
    await page.route(THIRD_PARTY, (route) => route.abort());
    await page.addInitScript((lang) => {
      try {
        localStorage.setItem('ednuva.language', lang);
        localStorage.setItem('i18nextLng', lang);
      } catch {}
    }, language);
    // The home page opens an announcements carousel dialog at random times; close it whenever it blocks an action.
    const announcement = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: text.closeDialog }) });
    await page.addLocatorHandler(announcement, async (dialog) => {
      await dialog.getByRole('button', { name: text.closeDialog }).click();
    });
    await use(page);
  },

  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  header: async ({ page }, use) => use(new HeaderComponent(page)),

  account: async ({}, use, testInfo) => {
    const account = loadAccount();
    testInfo.skip(!account, MISSING_ACCOUNT);
    await use(account!);
  },
});

export { expect };
