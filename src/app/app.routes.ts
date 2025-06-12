import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutSuccessComponent } from './components/checkout-success/checkout-success.component';

export const routes: Routes = [{
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./home/home.component').then(m => m.HomeComponent);
    }
},
{
    path: 'cart',
    loadComponent: () => {
        return import('./cart/cart.component').then(m => m.CartComponent);
    }
},
{
    path: 'products/:id',
    loadComponent: () => {
        return import('./components/product-detail/product-detail.component').then(m => m.ProductDetailComponent);
    }
},
{
    path: 'checkout-success',
    loadComponent: () => {
        return import('./components/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent);
    }
}];
