import { test as base, expect } from '@playwright/test';
import { HeaderComponent } from '../pages/HeaderComponent';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';
import type { TestUser } from '../data/userFactory';
import { userStore } from '../utils/userStore';

type Fixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  header: HeaderComponent;
  /** Account created (or supplied via env) by the setup project. */
  registeredUser: TestUser;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  signupPage: async ({ page }, use) => use(new SignupPage(page)),
  header: async ({ page }, use) => use(new HeaderComponent(page)),
  registeredUser: async ({}, use) => use(userStore.require()),
});

export { expect };
