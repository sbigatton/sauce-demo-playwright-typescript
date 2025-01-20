import { Locator, Page } from '@playwright/test';
import { ProductDetailsPage } from './product-details-page';

export class ProductListPage extends ProductDetailsPage {
    
    title : string = 'Products';
    private productsImageSelector = 'img.inventory_item_img'; 

    constructor(page: Page){
        super(page);     
    }

    getProductItemLocatorByName(name: string) : Locator {
        return this.page.locator(this.productItemSelector, { has: this.page.getByText(name) });        
    }

    getProductDescriptionByName(name: string) : Locator {
         return this.getProductItemLocatorByName(name).locator(this.productDescriptionSelector);
    }

    getProductPriceByName(name: string) : Locator {
        return this.getProductItemLocatorByName(name).locator(this.productPriceSelector);
    }

    getProductImageByName(name: string) : Locator {
        return this.getProductItemLocatorByName(name).locator(this.productsImageSelector);
    }

    getProductButtonByName(name: string) : Locator {
        return this.getProductItemLocatorByName(name).locator('button');
    }

    async addProductToCartByName(name: string) : Promise<void> {
        await this.getProductItemLocatorByName(name).getByText('Add to cart', { exact: true }).click();
    }

    async removeProductByName(name: string) : Promise<void> {
        await this.getProductItemLocatorByName(name).getByText('Remove', { exact: true }).click();
    }

    async goToProduct(name: string) : Promise<void> {
        await this.getProductItemLocatorByName(name).locator(this.productNameSelector, { hasText: name }).click();
    }
}