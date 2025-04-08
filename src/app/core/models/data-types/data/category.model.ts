import { S3File } from "@models/utils/file.model";

export class Category {
    id: number;
    name: string;
    description: string;
    imageName: string;
    userId: number;
    accountId: number;
    image: S3File | null;
    paymentTypes?: CategoryHasPaymentType[];
}

export class CategoryHasPaymentType {
    id: CategoryHasPaymentTypeId;
    phone: number;
    email: string;
    accountNumber: string;
    accountType: string;
    accountBank: string;
    state: string;
}

export class CategoryHasPaymentTypeId {
    categoryId: number;
    paymentTypeId: number;
}