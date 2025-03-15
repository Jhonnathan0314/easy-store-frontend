import { S3File } from "@models/utils/file.model";

export class Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
    qualification: number;
    description: string;
    subcategoryId: number;
    imageName: string;
    image?: S3File;
}