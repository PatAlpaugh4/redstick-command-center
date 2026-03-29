/**
 * TypeScript Type Definitions
 * ===========================
 * Central type definitions for the dashboard application.
 */

// User Types
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  createdAt: Date
  lastActive: Date
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image?: string
  createdAt: Date
}

// Analytics Types
export interface Metric {
  label: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  prefix?: string
  suffix?: string
}

export interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

export interface TimeSeriesData {
  date: string
  value: number
  previousValue?: number
}

// Dashboard Types
export interface DashboardStats {
  totalRevenue: Metric
  totalUsers: Metric
  totalOrders: Metric
  conversionRate: Metric
}

export interface RecentActivity {
  id: string
  type: 'user_signup' | 'order_placed' | 'product_added' | 'review_submitted'
  message: string
  user?: User
  timestamp: Date
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
  children?: NavItem[]
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea'
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Search Types
export type SearchableItemType = 'deal' | 'company' | 'contact' | 'document'

export interface SearchableItem {
  id: string
  type: SearchableItemType
  title: string
  subtitle?: string
  url: string
}
