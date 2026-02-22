import { test, expect } from '@playwright/test';
import {faker} from '@faker-js/faker';

test('Purchase flow', async ({ page }) => {

    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('.title')).toHaveText('Products');

    const products = page.locator('.inventory_item');
    const count = await products.count();
    console.log(count);

    for (let i = 0; i < count; i++) {
        const product = products.nth(i);
        await product.getByRole('button', { name: 'Add to cart' }).click();
    }

    await expect(page.locator('.shopping_cart_badge')).toHaveText(count.toString());
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(count);
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.getByRole('textbox', { name: 'First Name' }).fill(faker.person.firstName());
    await page.getByRole('textbox', { name: 'Last Name' }).fill(faker.person.lastName());
    await page.getByRole('textbox', { name: 'Postal Code' }).fill(faker.location.zipCode());
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(page.locator('.summary_total_label')).toHaveText('Total: $140.34');
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

})
