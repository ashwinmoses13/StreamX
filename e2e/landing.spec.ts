import fs from 'node:fs'
import path from 'node:path'
import { expect, test } from '@playwright/test'

test('auth flow and landing behaves like a Netflix row layout', async ({ page }) => {
  const omdbSeen = new Set<string>()

  page.on('request', (req) => {
    if (req.url().includes('omdbapi.com')) omdbSeen.add(req.url())
  })

  await page.goto('/register')
  await page.locator('input[type="email"]').fill('playwright@example.com')
  await page.locator('input[type="password"]').fill('pw123456')
  await page.locator('.auth__btn').click()
  await expect(page.locator('.toast--success')).toContainText('Account created successfully')
  await page.waitForURL('**/login')
  await page.locator('input[type="email"]').fill('playwright@example.com')
  await page.locator('input[type="password"]').fill('pw123456')
  await page.locator('.auth__btn').click()
  await expect(page.locator('.toast--success')).toContainText('Login successfully')
  await page.waitForURL('**/')

  await expect(page.locator('.nav__logo')).toHaveText('STREAMX')
  await expect(page.locator('.hero')).toBeVisible()

  // Wait for hero to resolve (it starts at "Loading…")
  await expect(page.locator('.hero__title')).not.toHaveText('Loading…')

  await expect(page.locator('.row')).toHaveCount(7)
  expect(await page.locator('.card').count()).toBeGreaterThan(12)

  // Open modal by clicking a card
  await page.locator('.card').first().click()
  await expect(page.locator('.modalOverlay')).toBeVisible()
  await expect(page.locator('.modal__body h2')).not.toHaveText('Loading…')

  // Close with Escape
  await page.keyboard.press('Escape')
  await expect(page.locator('.modalOverlay')).toBeHidden()

  // Ensure OMDb was actually requested
  expect([...omdbSeen].length).toBeGreaterThan(0)

  const outDir = path.join(process.cwd(), 'e2e-artifacts')
  fs.mkdirSync(outDir, { recursive: true })
  await page.screenshot({ path: path.join(outDir, 'landing.png'), fullPage: true })
})
