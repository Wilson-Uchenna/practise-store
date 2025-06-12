import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../../models/image.type';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-item',
  imports: [CurrencyPipe, ReactiveFormsModule],
  standalone: true,
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent implements OnInit {
  @Input() item: { product: Product; quantity: number } | null = null;
  @Output() remove = new EventEmitter<string>();

  quantityControl!: FormControl<number>;
  quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private cartService: CartService) {}

  ngOnInit() {
    if (this.item?.product?.id) {
      this.quantityControl = this.cartService.getQuantityControl(this.item.product.id);
    }
  }

  onRemove() {
    if (this.item) {
      this.remove.emit(this.item.product.id);
    }
  }
}
