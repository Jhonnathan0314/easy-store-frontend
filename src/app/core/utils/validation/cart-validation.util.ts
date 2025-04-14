import { Product } from "@models/data/product.model";
import { Purchase } from "@models/data/purchase.model";

export function cartHasProduct(cart: Purchase, product: Product): boolean {
    if(!cart.products) return false;
    return cart.products.find(p => p.id.productId == product.id) != undefined;
}