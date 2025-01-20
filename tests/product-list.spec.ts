import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { Header} from '../pages/header';
import { ProductListPage } from '../pages/product-list-page';
import { ProductDetailsPage } from '../pages/product-details-page';
import { Product } from '../models/product';

import productsData from '../data/products.json';
import account from '../data/account.json';
import { BasePage } from '../pages/base-page';

const products : Product[] = productsData.map((p: any) => { 
    return { name: p.name, description: p.description ?? "", image: p.image ?? "", price: p.price } 
} ); 

const productNames = products.map(product => product.name);

test.describe('Products page', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigateToMainPage();
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);
    });

    test('should display expected list of products', async ({ page }) => {
        const productListPage = new ProductListPage(page);
        expect(productListPage.getProductNameLocator()).toHaveText(productNames);
    });

    test('should display Sauce Labs Bike Light product details as expected', async ({ page }) => {
        const product = products.find(product => product.name === 'Sauce Labs Bike Light') as Product;
        const productListPage = new ProductListPage(page);
        expect(productListPage.getProductDescriptionByName(product.name)).toHaveText(product.description);
        expect(productListPage.getProductPriceByName(product.name)).toHaveText(`$${product.price}`);
        expect(productListPage.getProductImageByName(product.name)).toHaveAttribute('src', product.image);
        expect(productListPage.getProductButtonByName(product.name)).toHaveText('Add to cart');
    });

    test('should add / remove items to cart and display correct count', async ({ page }) => {        
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        await productListPage.addProductToCartByName(productNames[1]);
        expect(header.getCartButtonCounterLocator()).toHaveText('1');
        expect(productListPage.getProductButtonByName(productNames[1])).toHaveText('Remove');
        await productListPage.addProductToCartByName(productNames[2]);
        expect(header.getCartButtonCounterLocator()).toHaveText('2');
        expect(productListPage.getProductButtonByName(productNames[2])).toHaveText('Remove');
        await productListPage.removeProductByName(productNames[1]);
        expect(header.getCartButtonCounterLocator()).toHaveText('1');
        expect(productListPage.getProductButtonByName(productNames[1])).toHaveText('Add to cart');
    });

    test('should navigate to product detail and go back', async ({ page }) => {
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        const productDetailsPage = new ProductDetailsPage(page);
        await productListPage.goToProduct(productNames[1]);
        expect(header.getBackToProductLocator()).toHaveText(productDetailsPage.title);
        expect(productDetailsPage.getProductNameLocator()).toHaveText(productNames[1]);
        await header.goBackToProducts();
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);
    });

    test('should sort products properly', async ({ page }) => {
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        
        expect(header.getActiveFilterOptionLocator()).toHaveText('Name (A to Z)');
        const productNamesAtoZ = productNames.sort();
        expect(productListPage.getProductNameLocator()).toHaveText(productNamesAtoZ);
        
        await header.selectFilterOption('Name (Z to A)');
        const productNamesZtoA = productNames.sort((a, b) => b.localeCompare(a));
        expect(productListPage.getProductNameLocator()).toHaveText(productNamesZtoA);

        await header.selectFilterOption('Price (low to high)');
        const lowToHigh = products.sort((a, b) => a.price - b.price);
        const lowToHighProductNames = lowToHigh.map(product => product.name);
        expect(productListPage.getProductNameLocator()).toHaveText(lowToHighProductNames);

        await header.selectFilterOption('Price (high to low)');
        const highToLow = products.sort((a, b) => b.price - a.price);
        const highToLowProductNames = highToLow.map(product => product.name);
        expect(productListPage.getProductNameLocator()).toHaveText(highToLowProductNames);
    });
});