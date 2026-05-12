import { test, expect } from '@playwright/test'

// 시나리오 1: 엔트리 화면 → 게임 시작
test('시나리오1: 엔트리 화면에서 지금 플레이 클릭 시 게임이 시작된다', async ({ page }) => {
  await page.goto('/')

  // 엔트리 화면 확인
  await expect(page.getByText('TETRIS')).toBeVisible()
  await expect(page.getByRole('button', { name: '▶ 지금 플레이' })).toBeVisible()

  // 게임 시작
  await page.getByRole('button', { name: '▶ 지금 플레이' }).click()

  // 게임 보드가 표시됨 (role=grid)
  await expect(page.getByRole('grid', { name: '테트리스 게임 보드' })).toBeVisible()

  // 점수/레벨 패널 확인
  await expect(page.getByText('Score')).toBeVisible()
  await expect(page.getByText('Level')).toBeVisible()
  await expect(page.getByText('Next')).toBeVisible()
})

// 시나리오 2: 게임 중 일시정지 → 재개
test('시나리오2: P 키로 일시정지하고 Resume 버튼으로 재개된다', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '▶ 지금 플레이' }).click()

  // 게임 보드 표시 확인
  await expect(page.getByRole('grid')).toBeVisible()

  // P 키로 일시정지
  await page.keyboard.press('p')
  await expect(page.getByRole('dialog', { name: '일시정지' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible()

  // Resume 버튼 클릭으로 재개
  await page.getByRole('button', { name: 'Resume' }).click()
  await expect(page.getByRole('dialog', { name: '일시정지' })).not.toBeVisible()
  await expect(page.getByRole('grid')).toBeVisible()
})

// 시나리오 3: 게임 오버 → Play Again
test('시나리오3: 게임 오버 후 Play Again으로 새 게임 시작', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '▶ 지금 플레이' }).click()
  await expect(page.getByRole('grid')).toBeVisible()

  // 게임 오버를 강제로 유발: Space(하드드롭) 를 빠르게 반복
  // 피스가 계속 쌓이면 결국 게임 오버가 됨
  // 여기서는 store를 직접 조작할 수 없으므로 기존 UI로 테스트
  // gameOver 상태를 페이지 evaluate로 강제 설정
  await page.evaluate(() => {
    // zustand store를 window에 노출해서 gameOver 강제 설정
    // store가 window에 없으면 skip
    const w = window as unknown as Record<string, unknown>
    if (w.__tetrisDebug) {
      (w.__tetrisDebug as { triggerGameOver: () => void }).triggerGameOver()
    }
  })

  // 게임 오버 다이얼로그 없으면 Space 키로 빠르게 쌓기
  const gameOverDialog = page.getByRole('dialog', { name: '게임 오버' })
  const isGameOver = await gameOverDialog.isVisible().catch(() => false)

  if (!isGameOver) {
    // Space 하드드롭 반복으로 게임 오버 유도 (최대 50회)
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Space')
      await page.waitForTimeout(50)
      const over = await gameOverDialog.isVisible().catch(() => false)
      if (over) break
    }
  }

  // 게임 오버 확인
  await expect(gameOverDialog).toBeVisible({ timeout: 10000 })
  await expect(page.getByRole('button', { name: 'Play Again' })).toBeVisible()
  await expect(page.getByText('Game Over')).toBeVisible()

  // Play Again 클릭
  await page.getByRole('button', { name: 'Play Again' }).click()

  // 새 게임 시작됨
  await expect(gameOverDialog).not.toBeVisible()
  await expect(page.getByRole('grid')).toBeVisible()
})
