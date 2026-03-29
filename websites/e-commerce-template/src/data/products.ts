/**
 * Products Data
 * =============
 * Mock product data for the e-commerce store.
 */

import type { Product } from '../types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    rating: 4.8,
    reviews: 256,
    inStock: true,
  },
  {
    id: '3',
    name: 'Leather Backpack',
    description: 'Genuine leather backpack with laptop compartment.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    rating: 4.3,
    reviews: 89,
    inStock: true,
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with cushioned sole.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Sports',
    rating: 4.6,
    reviews: 342,
    inStock: true,
  },
  {
    id: '5',
    name: 'Coffee Maker',
    description: 'Programmable 12-cup coffee maker with thermal carafe.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    category: 'Home',
    rating: 4.4,
    reviews: 167,
    inStock: false,
  },
  {
    id: '6',
    name: 'Yoga Mat',
    description: 'Extra thick, non-slip exercise yoga mat.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    rating: 4.7,
    reviews: 203,
    inStock: true,
  },
]

export const categories = [...new Set(products.map((p) => p.category))]
