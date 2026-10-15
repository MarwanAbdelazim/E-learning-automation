import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';
import type { FrameworkOptions } from './src/fixtures';

export default defineConfig<FrameworkOptions>({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 1,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: env.recordVideo ? 'on' : 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 45_000,
  },
  projects: [
    // Logs in with TEST_USER_* (or signs up when TEST_MOBILE/TEST_OTP are set) and saves the session.
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium-ar',
      use: { ...devices['Desktop Chrome'], language: 'ar' },
      dependencies: ['setup'],
    },
    {
      name: 'chromium-en',
      use: { ...devices['Desktop Chrome'], language: 'en' },
      dependencies: ['setup'],
      grep: /@i18n/,
    },
  ],
});
