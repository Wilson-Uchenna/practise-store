import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutDataService {
  data: {
    name?: string;
    shippingAddress?: string;
    creditCardNumber?: string;
    totalCost?: number;
  } = {};

  set(data: typeof this.data) {
    this.data = data;
  }

  get() {
    return this.data;
  }

  clear() {
    this.data = {};
  }
}
