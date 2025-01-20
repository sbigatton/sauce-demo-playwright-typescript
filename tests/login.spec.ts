import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { BasePage } from '../pages/base-page';
import { Header } from '../pages/header';
import { ProductListPage } from '../pages/product-list-page';

import account from '../data/account.json';

test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);
        await basePage.navigateToMainPage();
    });

    test('should redirect the user to products page', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        const productListPage = new ProductListPage(page);
        expect(header.getPageTitleLocator()).toHaveText(productListPage.title);
        expect(header.getCartButtonLocator()).toBeVisible();        
    });

    test('should display invalid credentials error', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.clickOnLoginButton();
        expect(loginPage.getErrorContainerLocator()).toHaveText('Epic sadface: Username is required');
        await loginPage.fillUserName(account.username);
        await loginPage.clickOnLoginButton();
        expect(loginPage.getErrorContainerLocator()).toHaveText('Epic sadface: Password is required');
        await loginPage.fillPassword('invalidPassword');
        await loginPage.clickOnLoginButton();
        expect(loginPage.getErrorContainerLocator()).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('should display an error navigating with user not logged in', async ({ page }) => {
        await page.goto('https://www.saucedemo.com/inventory.html');        
        const loginPage = new LoginPage(page);        
        expect(loginPage.getErrorContainerLocator()).toHaveText('Epic sadface: You can only access \'/inventory.html\' when you are logged in.');
    });

    test('should redirect to login page on logout', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(account.username, account.password);
        const header = new Header(page);
        await header.openMenu();
        await header.logout();
        expect(loginPage.getLoginButtonLocator()).toBeVisible();
    });
});