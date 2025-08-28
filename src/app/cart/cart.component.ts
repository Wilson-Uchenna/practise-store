import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CheckoutDataService } from '../services/checkout-data.service';
import { CartItemComponent } from '../components/cart-item/cart-item.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, ReactiveFormsModule, MatSnackBarModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  private cartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private router = inject(Router); // Add this if you're navigating
  private checkoutDataService = inject(CheckoutDataService);

  name: string = '';
shippingAddress: string = '';
creditCardNumber: string = '';

onNameChange(value: string) {
  this.name = value;
  console.log('Name changed via ngModelChange:', value);
}

onAddressChange(value: string) {
  this.shippingAddress = value;
  console.log('Address changed via ngModelChange:', value);
}

onCardChange(value: string) {
  // strip out non-numeric characters for practice
  this.creditCardNumber = value.replace(/\D/g, '');
  console.log('Card changed via ngModelChange:', this.creditCardNumber);
}



  cart$ = this.cartService.getCart();

  checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    creditCardNumber: ['', [
    Validators.required,
    Validators.minLength(16),
    Validators.pattern(/^[0-9]*$/)   // only numbers allowed
  ]],
    shippingAddress: ['', [Validators.required, Validators.minLength(3)]],
  });

  removeFromCart(id: string) {
    this.cartService.removeFromCart(id);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  get totalItems() {
    return this.cartService.totalItems();
  }

  get totalCost() {
    return this.cartService.totalCost();
  }

  onCheckout() {
    if (this.checkoutForm.valid) {
      const { name, creditCardNumber, shippingAddress } = this.checkoutForm.value;

      this.snackBar.open('Checkout successful!', 'Close', {
        duration: 3000,
        panelClass: ['bg-green-600', 'text-white']
      });

      this.checkoutDataService.set({
        name,
        shippingAddress,
        creditCardNumber,
        totalCost: this.totalCost
      });

      this.router.navigate(['/checkout-success']);


    } else {
      this.checkoutForm.markAllAsTouched(); // Mark fields so errors show
      this.snackBar.open('Please fill in all fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['bg-red-600', 'text-white']
      });
    }
  }
}
