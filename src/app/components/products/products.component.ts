import { Component, OnInit, inject } from '@angular/core';
import { ProductItemComponent } from "../product-item/product-item.component";
import { ImagesService } from "../../services/images.service";
import { CartService } from "../../services/cart.service";
import { Product, ImageType } from "../../../models/image.type";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductItemComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private imagesService = inject(ImagesService );
  private CartService = inject(CartService);
  private snackBar = inject(MatSnackBar)

  images: Product[] = [];
  loading = false;

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
  this.loading = true;
  this.imagesService.getRandomImages(6).subscribe({
    next: (data) => {
      // Only display first 3 on initial load
      this.images = data.slice(0, 3);
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading images', err);
      this.loading = false;
    }
  });
}



loadMore(): void {
  this.loading = true;
  this.imagesService.getRandomImages(6, true).subscribe({
    next: (data) => {
      // `data` is already Product[], so no need to remap again
      this.images = [...this.images, ...data];
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading more images', err);
      this.loading = false;
    }
  });
}




onAddToCart(event: { product: Product; quantity: number }): void {
  this.CartService.addToCart(event.product, event.quantity);
  console.log('Added to cart:', event.product, 'Qty:', event.quantity);

  this.snackBar.open('Added to cart!', 'Close', {
    duration: 3000,
    panelClass: ['bg-green-600', 'text-white']
  });

};

}