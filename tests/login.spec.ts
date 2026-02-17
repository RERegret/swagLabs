import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';


test.beforeEach(async ({ page }) => {
    await page.goto('https://saucedemo.com/');
});

test('Successful login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('standard_user', 'secret_sauce');

    await expect(login.page.locator('[data-test="title"]')).toHaveText('Products');

    await login.logout();

    await expect(login.page.getByRole('textbox', { name: 'Username' })).toBeEmpty();
    await expect(login.page.getByRole('textbox', { name: 'Password' })).toBeEmpty();
    await expect(login.page.getByRole('button', { name: 'Login' })).toBeVisible();
});

test('Failed login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('problem_user', 'secretNotSauce');
    const errorMessage = login.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    await expect(login.page.locator('.error-button')).toBeVisible();
    await login.page.locator('.error-button').click();
    await expect(errorMessage).toBeHidden();
});

test('Locked out user', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('locked_out_user', 'secret_sauce');
    const errorMessage = login.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(login.page.locator('.error-button')).toBeVisible();
    await login.page.locator('.error-button').click();
    await expect(errorMessage).toBeHidden();
});

test('Missing credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.page.getByRole('button', { name: 'Login' }).click();
    const errorMessage = login.getErrorMessage();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(login.page.locator('.error-button')).toBeVisible();
    await login.page.locator('.error-button').click();
    await expect(errorMessage).toBeHidden();

    await login.page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
    await login.page.getByRole('button', { name: 'Login' }).click();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Password is required');
    await expect(login.page.locator('.error-button')).toBeVisible();
    await login.page.locator('.error-button').click();
    await expect(errorMessage).toBeHidden();

    await login.page.getByRole('textbox', { name: 'Username' }).fill('');
    await login.page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await login.page.getByRole('button', { name: 'Login' }).click();
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(login.page.locator('.error-button')).toBeVisible();
    await login.page.locator('.error-button').click();
    await expect(errorMessage).toBeHidden();
});