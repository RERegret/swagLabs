import { Page, Locator, expect } from '@playwright/test';

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

  async emptyLogin() {
    await this.loginButton.click();
  }

  async userNameOnlyLogin(username: string) {
    await this.username.fill(username);
    await this.loginButton.click();
  }

  async passwordOnlyLogin(password: string) {
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

  async successfulLogin() {
    await this.login('standard_user', 'secret_sauce');
    await expect(this.title).toHaveText('Products');
    await this.logout();
    await expect(this.username).toBeEmpty();
    await expect(this.password).toBeEmpty();
    await expect(this.loginButton).toBeVisible();
  }

  async failedLogin() {
    await this.login('problem_user', 'secretNotSauce');

    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    await expect(this.errorButton).toBeVisible();
    await this.errorButton.click();
    await expect(this.errorMessage).toBeHidden();

  }

  async lockedOut() {
    await this.login('locked_out_user', 'secret_sauce');
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(this.errorButton).toBeVisible();
    await this.errorButton.click();
    await expect(this.errorMessage).toBeHidden();
  }

  async missingCredentials() {

    await this.emptyLogin();
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(this.errorButton).toBeVisible();
    await this.errorButton.click();
    await expect(this.errorMessage).toBeHidden();

    await this.userNameOnlyLogin('locked_out_user');
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Epic sadface: Password is required');
    await expect(this.errorButton).toBeVisible();
    await this.errorButton.click();
    await expect(this.errorMessage).toBeHidden();
    await this.clearCredentials();
    await this.passwordOnlyLogin('secret_sauce');
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText('Epic sadface: Username is required');
    await expect(this.errorButton).toBeVisible();
    await this.errorButton.click();
    await expect(this.errorMessage).toBeHidden();
  }
}