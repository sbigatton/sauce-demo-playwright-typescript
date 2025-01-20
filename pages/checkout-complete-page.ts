import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class CheckoutCompletePage extends BasePage {
    
    title : string = 'Checkout: Complete!';
    private successImageSelector : string = '.pony_express';
    private thankYouMsgSelector : string = '.complete-header';
    private orderMsgSelector : string = '.complete-text';

    constructor(page: Page){
        super(page);
    }

    getSuccessImage() : Locator {
        return this.page.locator(this.successImageSelector)
    }

    getThankYouMsg() : Locator {
        return this.page.locator(this.thankYouMsgSelector)
    }

    getOrderMsg() : Locator {
        return this.page.locator(this.orderMsgSelector)
    }

    async backHome() : Promise<void> {
        await this.page.getByText('Finish', { exact: true }).click();
    }
}