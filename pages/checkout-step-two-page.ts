import { Page } from '@playwright/test';
import { CartPage } from './cart-page'

export class CheckoutStepTwoPage extends CartPage {
    
    title : string = 'Checkout: Overview';

    constructor(page: Page){
        super(page);
    }

    async cancel() : Promise<void> {
        await this.page.getByText('Cancel', { exact: true }).click();
    }

    async finish() : Promise<void> {
        await this.page.getByText('Finish', { exact: true }).click();
    }
}