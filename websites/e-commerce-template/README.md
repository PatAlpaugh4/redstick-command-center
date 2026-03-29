# E-Commerce Template

A basic e-commerce structure with cart functionality, product catalog, and checkout flow. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Product Catalog** - Browse products with category filtering
- **Shopping Cart** - Add, remove, and update quantities
- **Product Details** - Full product view with images and descriptions
- **Checkout Flow** - Simple checkout form
- **Responsive Design** - Works on all devices
- **Cart Persistence** - Cart state managed via React Context

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
e-commerce-template/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Layout.tsx     # Main layout with header/footer
│   │   └── ProductCard.tsx
│   ├── context/           # React Context
│   │   └── CartContext.tsx
│   ├── data/              # Mock data
│   │   └── products.ts
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── App.tsx            # Main app
│   └── main.tsx           # Entry point
├── index.html
├── package.json
└── tailwind.config.js
```

## Cart Context API

```typescript
const { 
  items,           // Cart items
  addToCart,       // (product, quantity?) => void
  removeFromCart,  // (productId) => void
  updateQuantity,  // (productId, quantity) => void
  clearCart,       // () => void
  totalItems,      // number
  totalPrice       // number
} = useCart()
```

## Product Type

```typescript
interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
  inStock: boolean
}
```

## Kimi Prompts

### Add New Product
```
Add a new product to the products array in src/data/products.ts.
Include name, description, price, image URL, category, rating, and stock status.
```

### Add Category Filter
```
Add a category filter dropdown to the Products page.
Filter products by the selected category.
```

### Add Search
```
Add a search bar to the header that filters products by name.
Show search results on the Products page.
```

## Customization

### Change Colors
Edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    600: '#your-color',
  },
}
```

### Add Payment Integration
Replace the checkout form submission with your payment provider:

```typescript
const handleSubmit = async (e) => {
  e.preventDefault()
  // Integrate Stripe, PayPal, etc.
}
```

## Deployment

Build the static files:

```bash
npm run build
```

Deploy the `dist/` folder to:
- Netlify
- Vercel
- GitHub Pages
- Any static host

## License

MIT License - Free for personal and commercial use.

---

Built with ❤️ by Kimi Code
