export class Product {
    name : string;
    description : string;
    image : string;
    price : number;

    constructor(name: string, description: string, image: string, price: number) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
    }
}