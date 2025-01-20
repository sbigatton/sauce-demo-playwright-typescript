import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class LoginPage extends BasePage  {
    
    private userNameSelector = '[data-test="username"]';
    private passwordSelector = '[data-test="password"]';
    private loginButtonSelector = '[data-test="login-button"]';
    private errorContainerSelector = '[data-test="error"]'; 

    constructor(page: Page) {
        super(page);       
    }

    getErrorContainerLocator() : Locator {
        return this.page.locator(this.errorContainerSelector);
    }

    getLoginButtonLocator() : Locator {
        return this.page.locator(this.loginButtonSelector);
    }

    async login(userName: string, password: string) : Promise<void> {
        await this.page.fill(this.userNameSelector, userName);
        await this.page.fill(this.passwordSelector, password);
        await this.page.click(this.loginButtonSelector);
    }

    async fillUserName(userName: string) : Promise<void> {
        await this.page.fill(this.userNameSelector, userName);
    }

    async fillPassword(password: string): Promise<void> {
        await this.page.fill(this.passwordSelector, password);
    }

    async clickOnLoginButton() : Promise<void> {
        await this.page.click(this.loginButtonSelector);
    }   
}