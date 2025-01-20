import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProductDetailsPage extends BasePage{
    
    title : string = 'Back to products';
    protected productItemSelector = '[data-test="inventory-item"]';
    protected productNameSelector = '[data-test="inventory-item-name"]';
    protected productDescriptionSelector = '[data-test="inventory-item-desc"]';
    protected productPriceSelector = '[data-test="inventory-item-price"]';
    private productImageSelector = 'img.inventory_details_img';

    constructor(page: Page){
        super(page);
    }

    getProductItemLocator() : Locator {
        return this.page.locator(this.productItemSelector);
    }

    getProductNameLocator() : Locator {
        return this.page.locator(this.productNameSelector);
    }

    getProductDescriptionLocator() : Locator {
        return this.page.locator(this.productDescriptionSelector);
    }

    getProductPriceLocator() : Locator {
        return this.page.locator(this.productPriceSelector);
    }

    getProductImageLocator() : Locator       {
        return this.page.locator(this.productImageSelector);
    }

    getAddProductToCartLocator() : Locator       {
        return this.page.getByText('Add to cart', { exact: true });
    }

    getRemoveProductLocator() : Locator       {
        return this.page.getByText('Remove', { exact: true });
    }

    async addProductToCart() : Promise<void> {        
        await this.getAddProductToCartLocator().click();
    }

    async removeProduct() : Promise<void> {        
        await this.getRemoveProductLocator().click();
    }
}