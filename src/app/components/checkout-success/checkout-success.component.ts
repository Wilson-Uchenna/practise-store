import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CheckoutDataService } from '../../services/checkout-data.service';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss'
})
export class CheckoutSuccessComponent implements OnInit {
  private checkoutDataService = inject(CheckoutDataService);
  private router = inject(Router);

  name!: string;
  shippingAddress!: string;
  creditCardNumber!: string;
  totalCost!: number;

  ngOnInit() {
    const data = this.checkoutDataService.get();

    if (!data.name || !data.totalCost) {
      this.router.navigate(['/cart']); // redirect if no data
      return;
    }

    this.name = data.name;
    this.shippingAddress = data.shippingAddress!;
    this.creditCardNumber = data.creditCardNumber!;
    this.totalCost = data.totalCost;
  }
}
