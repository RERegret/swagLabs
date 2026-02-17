import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly title: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.title = page.locator('[data-test="title"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.locator('text=Logout');
    this.errorMessage = page.locator('.error-message-container h3');
    this.errorButton = page.locator('.error-button');
  }

  async goto() {
    await this.page.goto('https://saucedemo.com/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async clearCredentials() {
    await this.username.fill('');
    await this.password.fill('');
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}
