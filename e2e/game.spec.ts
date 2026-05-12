import { test, expect } from '@playwright/test'

test('게임 제목이 표시된다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Web Tetris' })).toBeVisible()
})
