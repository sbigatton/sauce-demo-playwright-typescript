import { Locator, Page } from '@playwright/test';
import { ProductDetailsPage } from './product-details-page';

export class CheckoutStepOnePage extends ProductDetailsPage {
    
    title = 'Checkout: Your Information';
    private firstNameSelector : string = '[data-test="firstName"]';
    private lastNameSelector : string = '[data-test="lastName"]';
    private zipCodeSelector : string = '[data-test="postalCode"]';
    private errorContainerSelector : string = '.error-message-container';

    constructor(page: Page){
        super(page);
    }

    getErrorContainerLocator() : Locator {
        return this.page.locator(this.errorContainerSelector);
    }

    async fillFirstName(firstName: string) : Promise<void> {
        await this.page.fill(this.firstNameSelector, firstName);
    }

    async fillLastName(lastName: string) : Promise<void> {
        await this.page.fill(this.lastNameSelector, lastName);
    }

    async fillZipCode(code: string) : Promise<void> {
        await this.page.fill(this.zipCodeSelector, code);
    }

    async continue() : Promise<void> {
        await this.page.getByText('Continue', { exact: true }).click();
    }

    async cancel() : Promise<void> {
        await this.page.getByText('Cancel', { exact: true }).click();
    }
}