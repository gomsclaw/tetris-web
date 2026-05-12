import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
const bypassToken = process.env.VERCEL_BYPASS_TOKEN

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html']] : 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...(bypassToken && {
      extraHTTPHeaders: { 'x-vercel-protection-bypass': bypassToken },
    }),
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // PLAYWRIGHT_BASE_URL 지정 시 로컬 dev 서버를 띄우지 않음 (production 대상 smoke test)
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
      },
})
