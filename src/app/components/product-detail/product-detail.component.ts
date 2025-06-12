import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesService } from '../../services/images.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../../models/image.type';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private imagesService = inject(ImagesService);
  
  quantityControl!: FormControl<number>;
  quantities = Array.from({ length: 10 }, (_, i) => i + 1);

  product$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => id ? this.imagesService.getImageById(id) : of(undefined))
  );

  constructor(private cartService: CartService) {
    
  }

ngOnInit() {
  this.product$.subscribe(product => {
    if (product) {
      this.quantityControl = this.cartService.getQuantityControl(product.id);
    }
  });
}

  

  addToCart(product: Product) {
    const quantity = this.quantityControl.value ?? 1;
    this.cartService.addToCart(product, quantity);
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  }
}
