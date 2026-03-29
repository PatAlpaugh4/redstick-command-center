/**
 * Home Page
 * =========
 * Landing page with featured products.
 */

import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/products'

export function Home() {
  const featuredProducts = products.slice(0, 4)

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Our Store
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Discover amazing products at great prices
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Shop Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center text-primary-600 font-semibold hover:underline"
            >
              View All Products
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
