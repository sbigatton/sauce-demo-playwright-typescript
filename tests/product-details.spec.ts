import { test, expect } from "@playwright/test";
import { BasePage } from "../pages/base-page";
import { LoginPage } from "../pages/login-page";
import { Header } from "../pages/header";
import { ProductListPage } from "../pages/product-list-page";
import { ProductDetailsPage } from "../pages/product-details-page";

import { Product } from "../models/product";

import account from "../data/account.json";
import products from "../data/products.json";


const product = products.find(product => product.name === 'Sauce Labs Bike Light') as Product;

test.describe('Product details page', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigateToMainPage();
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);      
        const productDetailsPage = new ProductDetailsPage(page);          
        await productListPage.goToProduct(product.name);
        expect(productDetailsPage.getProductNameLocator()).toHaveText(product.name);
    });

    test('should display Sauce Labs Bike Light product details as expected', async ({ page }) => {        
        const productDetailsPage = new ProductDetailsPage(page);
        expect(productDetailsPage.getProductNameLocator()).toHaveText(product.name);
        expect(productDetailsPage.getProductDescriptionLocator()).toHaveText(product.description);
        expect(productDetailsPage.getProductPriceLocator()).toHaveText(`$${product.price}`);
        expect(productDetailsPage.getProductImageLocator()).toHaveAttribute('src', product.image);
        expect(productDetailsPage.getAddProductToCartLocator()).toBeVisible();
    });

    test('should add / remove product to cart and display correct count', async ({ page }) => {        
        const header = new Header(page);
        const productDetailsPage = new ProductDetailsPage(page);
        await productDetailsPage.addProductToCart();
        expect(header.getCartButtonCounterLocator()).toHaveText('1');
        await productDetailsPage.removeProduct();
        expect(header.getCartButtonCounterLocator()).toBeHidden();
        expect(productDetailsPage.getAddProductToCartLocator()).toBeVisible();
    });
});