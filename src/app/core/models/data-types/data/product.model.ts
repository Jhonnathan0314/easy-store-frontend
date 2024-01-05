import { Subcategory } from "./subcategory.model";

export class Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    qualification: number;
    description: string;
    subcategory: Subcategory;
}