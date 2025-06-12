import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../models/image.type';
import { FormControl } from '@angular/forms';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSignal = signal<CartItem[]>([]);
  private quantityControl = new Map<string, FormControl<number>>();

  getCart() {
    return this.cartSignal.asReadonly();
  }

  addToCart(product: Product, quantity: number = 1) {
    const current = this.cartSignal();
    const index = current.findIndex(item => item.product.id === product.id);

    if (index > -1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        quantity: updated[index].quantity + quantity
      };
      this.cartSignal.set(updated);
    } else {
      this.cartSignal.set([...current, { product, quantity }]);
    }
  }

  removeFromCart(id: string) {
    const current = this.cartSignal();
    this.cartSignal.set(current.filter(item => item.product.id !== id));
    this.quantityControl.delete(id);
  }

  clearCart() {
    this.cartSignal.set([]);
    this.quantityControl.clear();
  }

  updateQuantity(productId: string, quantity: number) {
    const current = this.cartSignal();
    const updated = current.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    this.cartSignal.set(updated);
  }

  readonly totalItems = computed(() =>
    this.cartSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalCost = computed(() =>
    this.cartSignal().reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  );

  getQuantityControl(productId: string): FormControl<number> {
    const existingItem = this.cartSignal().find(item => item.product.id === productId);
    const initialQty = existingItem ? existingItem.quantity : 1;

    if (!this.quantityControl.has(productId)) {
      const control = new FormControl<number>(initialQty, { nonNullable: true});
      control.valueChanges.subscribe(newQty => {
        if (newQty != null && newQty > 0) {
          this.updateQuantity(productId, newQty);
        }
      });
      this.quantityControl.set(productId, control);
    }

    return this.quantityControl.get(productId)!;
  }
}
