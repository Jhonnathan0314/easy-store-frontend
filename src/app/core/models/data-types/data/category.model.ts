import { S3File } from "@models/utils/file.model";

export class Category {
    id: number;
    name: string;
    description: string;
    imageName: string;
    userId: number;
    accountId: number;
    image: S3File | null;
}