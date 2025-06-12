# StorePractise

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.10.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

# 🛒 Angular E-Commerce Cart App

This is a simple e-commerce cart application built with **Angular**. Users can browse products, add items to a cart, adjust quantities, and complete a checkout form with validation and feedback. The app uses **Reactive Forms**, **Control Flow Syntax**, and **Material UI snackbars**.

## 🚀 Features

- Browse random product images from Unsplash
- Add products to cart with quantity control
- Modify or remove cart items
- Real-time total cost and item count
- Validated checkout form (name, shipping address, credit card)
- Snack bar notifications for success and error
- Checkout confirmation page
- Caching of product images using localStorage

## 🧱 Tech Stack

- Angular 17+
- RxJS & Signals
- Tailwind CSS (or Angular styles)
- Angular Material (SnackBars)
- Unsplash API (for random images)
- localStorage (caching)
- TypeScript

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/angular-cart-app.git
   cd angular-cart-app

## Configuration
To fetch random product images, the app uses the Unsplash API.

Create an account on Unsplash Developers.

Get your ACCESS_KEY.

Add it in the ImagesService.

## Validation Rules
Checkout form:

Name: Required, 3–60 characters

Shipping Address: Required, 3+ characters

Credit Card Number: Required, minimum 16 digits

