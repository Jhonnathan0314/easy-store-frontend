import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  private CART_MESSAGE: string = "https://wa.me/+573202778890?text=Hola!%20%0A%0ATengo%20el%20carrito%20numero%20{cartId}%20y%20quisiera%20realizar%20la%20compra%20de%20los%20articulos%20incluidos%20en%20el.%20%0A%0ALos%20productos%20son%20%0A{products}";

  constructor() { }

  getCartMessage(cartId: string, products: string) {
    return this.CART_MESSAGE.replace("{cartId}", cartId).replace("{products}", products);
  }

}
