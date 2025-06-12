import { Component } from '@angular/core';
import { ProductsComponent } from '../components/products/products.component';

@Component({
  selector: 'app-home',
  imports: [ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
