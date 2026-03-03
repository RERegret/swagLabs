import { Page, Locator, expect } from '@playwright/test';
export class SidebarPage {
    readonly page: Page;
    readonly menuButton: Locator;
    readonly allItemsLink: Locator;
    readonly aboutLink: Locator;
    readonly resetAppStateLink: Locator;
    readonly logoutLink: Locator;
    //make login locators to be used in login function
    readonly username: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly firstItemAddToCartButton: Locator;
    readonly shoppingCartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuButton = page.getByRole('button', { name: 'Open Menu' });
        this.allItemsLink = page.locator('.bm-item.menu-item', { hasText: 'All Items' });
        this.aboutLink = page.locator('.bm-item.menu-item', { hasText: 'About' });
        this.resetAppStateLink = page.locator('.bm-item.menu-item', { hasText: 'Reset App State' });
        this.logoutLink = page.locator('.bm-item.menu-item', { hasText: 'Logout' });
        this.username = page.getByRole('textbox', { name: 'Username' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.firstItemAddToCartButton = page.locator('.pricebar').first().getByRole('button');
        this.shoppingCartBadge = page.locator('.shopping_cart_badge');
    }

    async login(username: string, password: string) {
        await this.username.fill(username);
        await this.password.fill(password);
        await this.loginButton.click();
    }

    async openMenu() {
        await this.menuButton.click();
    }
    async navigateToAllItems() {
        await this.allItemsLink.click();
    }

    async navigateToAbout() {
        await this.aboutLink.click();
        await expect(this.page).toHaveURL('https://saucelabs.com/');
    }

    async goBackToSaucedemo() {
        await this.page.goBack();
        await expect(this.page).toHaveURL('https://www.saucedemo.com/inventory.html');
    }

    async resetAppState() {
        await this.resetAppStateLink.click();
        await expect(this.shoppingCartBadge).toBeHidden();
    }

    async addFirstItemToCart() {
        await this.firstItemAddToCartButton.click();
        await expect(this.shoppingCartBadge).toBeVisible();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async workingSidebar() {
        await this.login('standard_user', 'secret_sauce');
        await expect(this.page.locator('.title')).toHaveText('Products');
        await this.openMenu();
        await this.navigateToAllItems();
        await this.navigateToAbout();
        await this.goBackToSaucedemo();
        await this.addFirstItemToCart();
        await this.openMenu();
        await this.resetAppState();
        await this.logout();
    }
}