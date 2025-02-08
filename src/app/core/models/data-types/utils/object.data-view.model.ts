import { PurchaseMap } from "@models/data/purchase.model";

export class DataObject {
    id?: number;
    name?: string;
    description?: string;
    image?: string;
    price?: number;
    quantity?: number;
    qualification?: number;
    subcategoryId?: number;
    subcategoryName?: string;
    categoryId?: number;
    categoryName?: string;

    purchase?: PurchaseMap;
}

export class DataObjectValidation {
    id: boolean;
    name: boolean;
    description: boolean;
    image: boolean;
    price: boolean;
    quantity: boolean;
    qualification: boolean;
    subcategoryId: boolean;
    subcategoryName: boolean;
    categoryId: boolean;
    categoryName: boolean;

    purchase: boolean;
}