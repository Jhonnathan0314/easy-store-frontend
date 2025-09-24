import { Product } from "@models/data/product.model";
import { Purchase } from "@models/data/purchase.model";

export function getProductsTextFromCart(cart: Purchase): string {
    const products = cart.products;
    const textArray = products.map(product => {
        return `%2D%20${product.product?.name.replaceAll(' ', '%20')}%3A%20${product.quantity}%20unidad%2Fes%20%3D%3E%20Subtotal%3A%20${product.subtotal}%20%0A`;
    })
    let productsText = "";
    textArray.forEach(txt => productsText += txt);
    productsText += `Valor%20total%3A%20%24%20${cart.total}`;
    return productsText;
}

export function getProductText(product: Product): string {
    return `%2D%20${product.name.replaceAll(' ', '%20')}%3A%201%20unidad%2Fes%20%3D%3E%20Subtotal%3A%20${product.price}%20%0A`;
}