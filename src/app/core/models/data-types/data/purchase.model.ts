import { User } from "@models/security/user.model";
import { Category } from "./category.model";
import { PaymentType } from "./payment-type.model";
import { Product } from "./product.model";

export class Purchase {
    id: number;
    userId: number;
    user?: User;
    paymentTypeId: number;
    paymentType?: PaymentType;
    categoryId: number;
    category?: Category;
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
    product?: Product;
    purchase?: Purchase;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export class PurchaseRq {
    userId: number;
    paymentTypeId: number;
    categoryId: number;
    state: string;
}

export class PurchaseHasProductRq {
    id: PurchaseHasProductId;
    quantity: number;
}