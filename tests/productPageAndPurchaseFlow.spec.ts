import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

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
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page.locator('.title')).toHaveText('Products');

})

test('Visual glitches', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('visual_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('.shopping_cart_container')).toBeVisible();
    await expect(page).not.toHaveScreenshot('visual_glitches_home.png')
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
    await page.locator('.shopping_cart_container').click();
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
    await expect(page).not.toHaveScreenshot('visual_glitches_checkout.png');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    await expect(page).not.toHaveScreenshot('visual_glitches_checkout_info.png');
    await page.getByRole('textbox', { name: 'First Name' }).fill(faker.person.firstName());
    await page.getByRole('textbox', { name: 'Last Name' }).fill(faker.person.lastName());
    await page.getByRole('textbox', { name: 'Postal Code' }).fill(faker.location.zipCode());
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    await expect(page).not.toHaveScreenshot('visual_glitches_checkout_overview.png');
    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page).not.toHaveScreenshot('visual_glitches_checkout_complete.png');
    await page.getByRole('button', { name: 'Back Home' }).click();
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page).not.toHaveScreenshot('visual_glitches_home.png');

});

test('Order items', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.title')).toHaveText('Products');

    let products = await page.locator('.inventory_item');
    const azSortedOrder = await products.evaluateAll(items => items.map(item => item.querySelector('.inventory_item_name')?.textContent));

    await page.locator('.product_sort_container').click();
    await page.locator('.product_sort_container').selectOption('za');
    products = await page.locator('.inventory_item');
    const zaSortedOrder = await products.evaluateAll(items => items.map(item => item.querySelector('.inventory_item_name')?.textContent));

    await expect(zaSortedOrder).toEqual(azSortedOrder?.slice().reverse());

    await page.locator('.product_sort_container').click();
    await page.locator('.product_sort_container').selectOption('lohi');
    products = await page.locator('.inventory_item');
    const lohiPrices = await products.evaluateAll(items => items.map(item => parseFloat(item.querySelector('.inventory_item_price')?.textContent?.replace('$', '') || '0')));
    expect(lohiPrices).toEqual([...lohiPrices].sort((a, b) => a - b));
    await page.locator('.product_sort_container').click();

    await page.locator('.product_sort_container').selectOption('hilo');
    products = await page.locator('.inventory_item');
    const hiloPrices = await products.evaluateAll(items => items.map(item => parseFloat(item.querySelector('.inventory_item_price')?.textContent?.replace('$', '') || '0')));
    expect(hiloPrices).toEqual([...hiloPrices].sort((a, b) => b - a));
    expect(hiloPrices).toEqual(lohiPrices.slice().reverse());
})