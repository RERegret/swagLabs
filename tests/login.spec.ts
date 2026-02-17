import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('https://saucedemo.com/');

    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('text=Logout').click();

    await expect(page.getByRole('textbox', { name: 'Username' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeEmpty();
    await expect(page.getByRole('button', {name: 'Login'})).toBeVisible();
});
