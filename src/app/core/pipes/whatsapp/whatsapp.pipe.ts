import { Purchase } from "@models/data/purchase.model";

export class WhatsappPipe {
    public getProductsText(cart: Purchase): string {
        const products = cart.products;
        const textArray = products.map(product => {
            return `%2D%20${product.product?.name.replaceAll(' ', '%20')}%3A%20${product.quantity}%20unidad%2Fes%20%3D%3E%20Subtotal%3A%20${product.subtotal}%20%0A`;
        })
        let productsText = "";
        textArray.forEach(txt => productsText += txt);
        productsText += `Valor%20total%3A%20%24%20${cart.total}`;
        return productsText;
    }
}