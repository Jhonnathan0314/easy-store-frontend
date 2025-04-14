import { Category } from "@models/data/category.model";
import { PaymentType, TablePaymentType } from "@models/data/payment-type.model";

export function convertToTablePaymentType(paymentType: PaymentType, category: Category): TablePaymentType[] {
    if(category.paymentTypes == null || category.paymentTypes == undefined) return [];
    return category.paymentTypes.map(hasPaymentType => ({
        category: category,
        paymentType: paymentType,
        phone: hasPaymentType.phone,
        email: hasPaymentType.email,
        accountNumber: hasPaymentType.accountNumber,
        accountType: hasPaymentType.accountType,
        accountBank: hasPaymentType.accountBank,
        state: hasPaymentType.state
    }))
}