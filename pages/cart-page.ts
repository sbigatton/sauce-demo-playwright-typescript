import { Page } from '@playwright/test';
import { ProductListPage }  from './product-list-page';

export class CartPage extends ProductListPage {
    
    title : string = 'Your Cart';
    protected quantitySelector : string = '[data-test="item-quantity"]';

    constructor(page: Page){
        super(page);
    }

    getProductQuantityByName(name: string){
        return super.getProductItemLocatorByName(name).locator(this.quantitySelector);
    }

    async checkout() : Promise<void> {
        await this.page.getByText('Checkout', { exact: true }).click();
    }

    async continueShopping() : Promise<void> {
        await this.page.getByText('Continue Shopping', { exact: true }).click();
    }
}