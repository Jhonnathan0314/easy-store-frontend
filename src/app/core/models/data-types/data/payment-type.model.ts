import { Category } from "./category.model";

export class PaymentType {
    id: number;
    name: string;
    state: string;
}

export class TablePaymentType {
    category: Category;
    paymentType: PaymentType;
    phone: number;
    email: string;
    accountNumber: string;
    accountType: string;
    accountBank: string;
    state: string;
}