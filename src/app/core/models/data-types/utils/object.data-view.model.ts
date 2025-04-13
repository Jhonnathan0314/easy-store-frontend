import { Purchase } from "@models/data/purchase.model";
import { S3File } from "./file.model";

export class DataObject {
    id?: number;
    name?: string;
    description?: string;
    image?: string;
    imageName?: string;
    imageObj?: S3File;
    price?: number;
    quantity?: number;
    qualification?: number;
    subcategoryId?: number;
    subcategoryName?: string;
    categoryId?: number;
    categoryName?: string;

    purchase?: Purchase;
}

export class DataObjectValidation {
    id: boolean;
    name: boolean;
    description: boolean;
    image: boolean;
    imageName: boolean;
    price: boolean;
    quantity: boolean;
    qualification: boolean;
    subcategoryId: boolean;
    subcategoryName: boolean;
    categoryId: boolean;
    categoryName: boolean;

    purchase: boolean;
    purchaseHasProduct: boolean;
}