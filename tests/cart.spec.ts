import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/base-page";
import { LoginPage } from "../pages/login-page";
import { Header } from "../pages/header";
import { ProductListPage } from "../pages/product-list-page";
import { CartPage } from "../pages/cart-page";
import { ProductDetailsPage } from "../pages/product-details-page";
import { CheckoutStepOnePage } from "../pages/checkout-step-one-page";

import { Product } from "../models/product";

import account from "../data/account.json";
import products from "../data/products.json";

const productA = products.find(product => product.name === 'Sauce Labs Bike Light') as Product;
const productB = products.find(product => product.name === 'Sauce Labs Bolt T-Shirt') as Product;  

test.describe('Cart page', () => {
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
        await expect(header.getCartButtonCounterLocator()).toHaveText('2');
    });

    test('should display added products as expected', async ({ page }) => {
        const header = new Header(page);
        await header.goToCart();
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);

        // Sauce Labs Bike Light
        expect(cartPage.getProductDescriptionByName(productA.name)).toHaveText(productA.description);
        expect(cartPage.getProductPriceByName(productA.name)).toHaveText(`$${productA.price}`);
        expect(cartPage.getProductQuantityByName(productA.name)).toHaveText('1');
        expect(cartPage.getProductButtonByName(productA.name)).toHaveText('Remove');
        
        // Sauce Labs Bolt T-Shirt
        expect(cartPage.getProductDescriptionByName(productB.name)).toHaveText(productB.description);
        expect(cartPage.getProductPriceByName(productB.name)).toHaveText(`$${productB.price}`);
        expect(cartPage.getProductQuantityByName(productB.name)).toHaveText('1');
        expect(cartPage.getProductButtonByName(productB.name)).toHaveText('Remove');
    });

    test('should remove products', async ({ page }) => {
        const header = new Header(page);
        await header.goToCart();
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);

        await cartPage.removeProductByName(productA.name);
        expect(cartPage.getProductItemLocatorByName(productA.name)).toBeHidden();
        
        expect(cartPage.getProductDescriptionByName(productB.name)).toHaveText(productB.description);
        expect(cartPage.getProductPriceByName(productB.name)).toHaveText(`$${productB.price}`);
        expect(cartPage.getProductQuantityByName(productB.name)).toHaveText('1');
        expect(cartPage.getProductButtonByName(productB.name)).toHaveText('Remove');

        await expect(header.getCartButtonCounterLocator()).toHaveText('1');
    });

    test('should continue shopping', async ({ page }) => {
        const header = new Header(page);
        await header.goToCart();
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);

        await cartPage.continueShopping();
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);
    });

    test('should navigate to product', async ({ page }) => {
        const header = new Header(page);
        await header.goToCart();
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);

        await cartPage.goToProduct(productA.name);
        const productDetailsPage = new ProductDetailsPage(page);
        expect(header.getBackToProductLocator()).toBeVisible();
        expect(productDetailsPage.getProductNameLocator()).toHaveText(productA.name);
        expect(productDetailsPage.getRemoveProductLocator()).toHaveText('Remove');
    });

    test('should checkout', async ({ page }) => {
        const header = new Header(page);
        await header.goToCart();
        const cartPage = new CartPage(page);
        expect(header.getPageTitleLocator()).toHaveText(cartPage.title);
        
        await cartPage.checkout();
        const checkoutStepOnePage = new CheckoutStepOnePage(page);
        expect(header.getPageTitleLocator()).toHaveText(checkoutStepOnePage.title);
    });
});