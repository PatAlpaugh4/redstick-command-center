/**
 * Product Detail Page
 * ===================
 * Single product view with add to cart.
 */

import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { products } from '../data/products'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === id)

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/products" className="text-primary-600 hover:underline">
          Back to Products
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="text-sm text-gray-500 mb-2">{product.category}</div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="ml-2 text-lg">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-3xl font-bold text-primary-600 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full btn btn-primary py-3 text-lg disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
