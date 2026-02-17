import { test, expect } from '@playwright/test';

test('navigation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.title')).toHaveText('Products');


    await page.getByRole('button', { name: 'Open Menu' }).click();

    await page.locator('.bm-item.menu-item', { hasText: 'All Items' }).click();
    await page.locator('.bm-item.menu-item', { hasText: 'About' }).click();
    await expect(page).toHaveURL('https://saucelabs.com/');
    await page.goBack();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await page.locator('.pricebar').first().getByRole('button').click();
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('.bm-item.menu-item', { hasText: 'Reset App State' }).click();
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
    await page.locator('.bm-item.menu-item', { hasText: 'Logout' }).click();
});