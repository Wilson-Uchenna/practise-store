import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Product } from '../../../models/image.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [ ReactiveFormsModule, RouterLink],
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() img!: Product;
  @Output() add = new EventEmitter<{product: Product, quantity: number}>();


  quantityControl!: FormControl<number>;
  quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private cartService: CartService) {
  }

  ngOnInit() {
     this.quantityControl = this.cartService.getQuantityControl(this.img.id);
  }

  addToCart() {
    const quantity = this.quantityControl.value ?? 1;
    this.add.emit({product: this.img, quantity});
  }
}
