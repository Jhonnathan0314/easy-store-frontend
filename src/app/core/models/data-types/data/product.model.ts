import { S3File } from "@models/utils/file.model";
import { Subcategory } from "./subcategory.model";

export class Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    qualification: number;
    description: string;
    subcategoryId: number;
    subcategory?: Subcategory;
    imageName: string;
    imageNumber: number;
    imageLastNumber: number;
    images: S3File[];
    categoryId: number;
}