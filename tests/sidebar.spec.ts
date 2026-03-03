import { test, expect } from '@playwright/test';
import { SidebarPage } from './pageObjects/SidebarPage';


test.beforeEach(async ({ page }) => {
    await page.goto('https://saucedemo.com/');
});

test('navigation', async ({ page }) => {
    const sidebar = new SidebarPage(page);
    await sidebar.workingSidebar();
});