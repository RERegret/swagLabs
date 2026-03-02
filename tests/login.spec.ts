import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';


test.beforeEach(async ({ page }) => {
    await page.goto('https://saucedemo.com/');
});

test('Successful login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.successfulLogin();
});

test('Failed login', async ({ page }) => {
    const login = new LoginPage(page);
    await login.failedLogin
});

test('Locked out user', async ({ page }) => {
    const login = new LoginPage(page);
    await login.lockedOut();
});

test('Missing credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.missingCredentials();
});