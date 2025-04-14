import { Category } from "@models/data/category.model";
import { PaymentType } from "@models/data/payment-type.model";
import { Subcategory } from "@models/data/subcategory.model";
import { PrimeNGObject } from "@models/utils/primeng-object.model";

export function convertToDataObject(object: Category | Subcategory | PaymentType): PrimeNGObject {
    return {
        name: object.name,
        value: `${object.id}`
    }
}

export function convertListToDataObjects(list: (Category | Subcategory | PaymentType)[]) {
    return list.map(convertToDataObject);
}