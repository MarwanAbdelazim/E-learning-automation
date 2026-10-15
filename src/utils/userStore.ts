import fs from 'fs';
import { env, paths } from '../config/env';
import type { TestUser } from '../data/userFactory';

/** Persists the account created by the setup project so other tests can reuse it. */
export const userStore = {
  save(user: TestUser) {
    fs.mkdirSync(paths.authDir, { recursive: true });
    fs.writeFileSync(paths.userFile, JSON.stringify(user, null, 2));
  },

  load(): TestUser | null {
    if (env.testUserEmail && env.testUserPassword) {
      return {
        firstName: '',
        lastName: '',
        fullName: '',
        phone: '',
        email: env.testUserEmail,
        password: env.testUserPassword,
      };
    }
    if (!fs.existsSync(paths.userFile)) return null;
    return JSON.parse(fs.readFileSync(paths.userFile, 'utf-8')) as TestUser;
  },

  require(): TestUser {
    const user = this.load();
    if (!user) {
      throw new Error(
        `No test user available. Run the "setup" project first (npx playwright test) or set TEST_USER_EMAIL/TEST_USER_PASSWORD.`,
      );
    }
    return user;
  },
};
