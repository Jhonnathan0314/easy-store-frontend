import { User } from "@models/security/user.model";
import { Category } from "./category.model";
import { PaymentType } from "./payment-type.model";

export class Purchase {
    id: number;
    userId: number;
    paymentTypeId: number;
    categoryId: number;
    total: number;
    state: string;
    creationDate: string;
    products: PurchaseHasProduct[];
}

export class PurchaseHasProductId {
    purchaseId: number;
    productId: number;
}

export class PurchaseHasProduct {
    id: PurchaseHasProductId;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export class PurchaseMap {
    id: number;
    user: User;
    paymentType: PaymentType;
    category: Category;
    total: number;
    state: string;
    creationDate: string;
    products: PurchaseHasProduct[];
}