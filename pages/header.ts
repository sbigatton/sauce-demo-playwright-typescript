import { Locator, Page } from "@playwright/test";
import { BasePage } from "./base-page";

export class Header extends BasePage{
    
    title : string = 'Swag Labs';
    private menuSelector : string = 'button#react-burger-menu-btn';
    private cartButtonSelector : string = '[data-test="shopping-cart-link"]';
    private cartButtonCounterSelector : string = '[data-test="shopping-cart-badge"]';
    private pageTitleSelector : string = '[data-test="title"]';
    private activeFilterOptionSelector : string = '[data-test="active-option"]';
    private selectFilterSelector : string = '[data-test="product-sort-container"]';
    private backToProductSelector : string = '#back-to-products';


    constructor(page: Page) {
        super(page);
    }

    getCartButtonLocator() : Locator {
        return this.page.locator(this.cartButtonSelector);
    }

    getCartButtonCounterLocator() : Locator {
        return this.page.locator(this.cartButtonCounterSelector);
    }

    getPageTitleLocator() : Locator {
        return this.page.locator(this.pageTitleSelector);
    }

    getActiveFilterOptionLocator() : Locator {
        return this.page.locator(this.activeFilterOptionSelector);
    }

    getBackToProductLocator() : Locator {
        return this.page.locator(this.backToProductSelector);
    }

    getSelectFilterOptionLocator() : Locator {
        return this.page.locator(this.selectFilterSelector);
    }

    async selectFilterOption(option : string) : Promise<void> {
        await this.getSelectFilterOptionLocator().selectOption(option);
    }

    async goToCart() : Promise<void> {
        await this.getCartButtonLocator().click();
    }

    async goBackToProducts() : Promise<void> {
        await this.getBackToProductLocator().click();
    }

    async openMenu() : Promise<void> {
        await this.page.click(this.menuSelector);
    }

    async logout() : Promise<void> {
        await this.page.getByText('Logout').click();
    }

    getFilterOptions(){
        return this.getSelectFilterOptionLocator().locator('option');
    }
}