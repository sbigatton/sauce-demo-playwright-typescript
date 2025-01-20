import { Page } from "@playwright/test";

export class BasePage {
    protected page : Page;

    constructor(page : Page){
        this.page = page;
    }

    async navigateToMainPage() : Promise<void> {
        await this.page.goto('https://www.saucedemo.com/');
    }
}   