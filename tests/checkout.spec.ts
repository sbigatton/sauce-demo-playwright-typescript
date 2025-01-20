import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/base-page";
import { LoginPage } from "../pages/login-page";
import { Header } from "../pages/header";
import { CartPage } from "../pages/cart-page";
import { ProductListPage } from "../pages/product-list-page";
import { CheckoutStepOnePage } from "../pages/checkout-step-one-page";
import { CheckoutStepTwoPage } from "../pages/checkout-step-two-page";
import { CheckoutCompletePage } from "../pages/checkout-complete-page";

import { Product } from "../models/product";

import account from "../data/account.json";
import products from "../data/products.json";

const productA = products.find(product => product.name === 'Sauce Labs Bike Light') as Product;
const productB = products.find(product => product.name === 'Sauce Labs Bolt T-Shirt') as Product;  

test.describe('Checkout information page', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigateToMainPage();
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);      
        await productListPage.addProductToCartByName(productA.name);
        await productListPage.addProductToCartByName(productB.name);
        await header.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.checkout();
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        expect(header.getPageTitleLocator()).toHaveText(checkoutStepOnePage.title);
    });

    test('should display information field validation messages', async ({ page }) => {
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.continue();
        expect(checkoutStepOnePage.getErrorContainerLocator()).toHaveText('Error: First Name is required');
        await checkoutStepOnePage.fillFirstName('Jason');
        await checkoutStepOnePage.continue();
        expect(checkoutStepOnePage.getErrorContainerLocator()).toHaveText('Error: Last Name is required');
        await checkoutStepOnePage.fillLastName('Born');
        await checkoutStepOnePage.continue();
        expect(checkoutStepOnePage.getErrorContainerLocator()).toHaveText('Error: Postal Code is required');
    });

    test('should cancel and navigate back to cart page', async ({ page }) => {
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.cancel();
        const header = new Header(page);
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);
        expect(cartPage.getProductItemLocatorByName(productA.name)).toBeVisible();
        expect(cartPage.getProductItemLocatorByName(productB.name)).toBeVisible();
    });

    test('should continue to finish checkout', async ({ page }) => {
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.fillFirstName('Jason');
        await checkoutStepOnePage.fillLastName('Born');
        await checkoutStepOnePage.fillZipCode('19019');
        await checkoutStepOnePage.continue();
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        const header = new Header(page);
        expect(header.getPageTitleLocator()).toHaveText(checkoutStepTwoPage.title);
    });
});

test.describe('Checkout overview page', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigateToMainPage();
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);      
        await productListPage.addProductToCartByName(productA.name);
        await productListPage.addProductToCartByName(productB.name);
        await header.goToCart();
        const cartPage = new CartPage(page);
        await cartPage.checkout();
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        await checkoutStepOnePage.fillFirstName('Jason');
        await checkoutStepOnePage.fillLastName('Born');
        await checkoutStepOnePage.fillZipCode('19019');
        await checkoutStepOnePage.continue();
    });

    test('should cancel and navigate back to products page', async ({ page }) => {
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        await checkoutStepTwoPage.cancel();
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);      
        expect(header.getCartButtonCounterLocator()).toHaveText('2');
        expect(productListPage.getProductButtonByName(productA.name)).toHaveText('Remove');
        expect(productListPage.getProductButtonByName(productB.name)).toHaveText('Remove');
    });

    test('should display product details as expected', async ({ page }) => {
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);

        // Sauce Labs Bike Light
        expect(checkoutStepTwoPage.getProductDescriptionByName(productA.name)).toHaveText(productA.description);
        expect(checkoutStepTwoPage.getProductPriceByName(productA.name)).toHaveText(`$${productA.price}`);
        expect(checkoutStepTwoPage.getProductQuantityByName(productA.name)).toHaveText('1');
        
        // Sauce Labs Bolt T-Shirt
        expect(checkoutStepTwoPage.getProductDescriptionByName(productB.name)).toHaveText(productB.description);
        expect(checkoutStepTwoPage.getProductPriceByName(productB.name)).toHaveText(`$${productB.price}`);
        expect(checkoutStepTwoPage.getProductQuantityByName(productB.name)).toHaveText('1');
    });

    test('should complete the order', async ({ page }) => {
        const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
        await checkoutStepTwoPage.finish();

        const header = new Header(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);
        expect(header.getPageTitleLocator()).toHaveText(checkoutCompletePage.title);
        expect(checkoutCompletePage.getThankYouMsg()).toBeVisible();
        expect(checkoutCompletePage.getSuccessImage()).toBeVisible();
        expect(checkoutCompletePage.getOrderMsg()).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    });
});