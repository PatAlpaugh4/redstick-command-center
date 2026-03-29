/**
 * Mock Data for Dashboard
 * =======================
 * Sample data for development and testing.
 * Replace with actual API calls in production.
 */

import type { 
  User, 
  Product, 
  DashboardStats, 
  RecentActivity,
  ChartData,
  TimeSeriesData 
} from '@types'

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalRevenue: {
    label: 'Total Revenue',
    value: 45231.89,
    change: 20.1,
    changeType: 'increase',
    prefix: '$',
  },
  totalUsers: {
    label: 'Total Users',
    value: 2350,
    change: 15.3,
    changeType: 'increase',
  },
  totalOrders: {
    label: 'Total Orders',
    value: 12234,
    change: 8.2,
    changeType: 'increase',
  },
  conversionRate: {
    label: 'Conversion Rate',
    value: 3.24,
    change: -2.1,
    changeType: 'decrease',
    suffix: '%',
  },
}

// Revenue Chart Data (Monthly)
export const revenueData: TimeSeriesData[] = [
  { date: 'Jan', value: 4000, previousValue: 3500 },
  { date: 'Feb', value: 3000, previousValue: 3200 },
  { date: 'Mar', value: 5000, previousValue: 4200 },
  { date: 'Apr', value: 4500, previousValue: 4100 },
  { date: 'May', value: 6000, previousValue: 5200 },
  { date: 'Jun', value: 5500, previousValue: 5000 },
  { date: 'Jul', value: 7000, previousValue: 6200 },
  { date: 'Aug', value: 6500, previousValue: 5800 },
  { date: 'Sep', value: 8000, previousValue: 7200 },
  { date: 'Oct', value: 7500, previousValue: 6800 },
  { date: 'Nov', value: 9000, previousValue: 8200 },
  { date: 'Dec', value: 8500, previousValue: 7800 },
]

// Sales by Category
export const salesByCategory: ChartData[] = [
  { name: 'Electronics', value: 4500 },
  { name: 'Clothing', value: 3200 },
  { name: 'Home & Garden', value: 2800 },
  { name: 'Sports', value: 1900 },
  { name: 'Books', value: 1200 },
]

// User Growth Data
export const userGrowthData: TimeSeriesData[] = [
  { date: 'Week 1', value: 120 },
  { date: 'Week 2', value: 180 },
  { date: 'Week 3', value: 250 },
  { date: 'Week 4', value: 320 },
  { date: 'Week 5', value: 400 },
  { date: 'Week 6', value: 480 },
  { date: 'Week 7', value: 550 },
  { date: 'Week 8', value: 620 },
]

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    lastActive: new Date(),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-20'),
    lastActive: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2024-03-10'),
    lastActive: new Date(Date.now() - 604800000),
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'viewer',
    status: 'pending',
    createdAt: new Date('2024-04-05'),
    lastActive: new Date(Date.now() - 172800000),
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.t@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-04-12'),
    lastActive: new Date(),
  },
]

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones Pro',
    description: 'Premium noise-canceling wireless headphones',
    price: 299.99,
    category: 'Electronics',
    stock: 45,
    status: 'in_stock',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '2',
    name: 'Smart Watch Series X',
    description: 'Advanced fitness tracking smartwatch',
    price: 399.99,
    category: 'Electronics',
    stock: 8,
    status: 'low_stock',
    createdAt: new Date('2024-02-15'),
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable and comfortable everyday wear',
    price: 29.99,
    category: 'Clothing',
    stock: 0,
    status: 'out_of_stock',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '4',
    name: 'Yoga Mat Premium',
    description: 'Extra thick, non-slip exercise mat',
    price: 49.99,
    category: 'Sports',
    stock: 120,
    status: 'in_stock',
    createdAt: new Date('2024-03-20'),
  },
  {
    id: '5',
    name: 'Coffee Maker Deluxe',
    description: 'Programmable 12-cup coffee maker',
    price: 89.99,
    category: 'Home & Garden',
    stock: 25,
    status: 'in_stock',
    createdAt: new Date('2024-04-01'),
  },
]

// Recent Activity
export const recentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'user_signup',
    message: 'New user registered',
    user: mockUsers[1],
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    type: 'order_placed',
    message: 'Order #1234 placed for $299.99',
    user: mockUsers[0],
    timestamp: new Date(Date.now() - 900000),
  },
  {
    id: '3',
    type: 'product_added',
    message: 'New product "Smart Watch Series X" added',
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: '4',
    type: 'review_submitted',
    message: 'New 5-star review received',
    user: mockUsers[2],
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: '5',
    type: 'user_signup',
    message: 'New user registered',
    user: mockUsers[3],
    timestamp: new Date(Date.now() - 7200000),
  },
]

// Traffic Sources
export const trafficSources: ChartData[] = [
  { name: 'Direct', value: 35 },
  { name: 'Organic Search', value: 28 },
  { name: 'Social Media', value: 18 },
  { name: 'Referral', value: 12 },
  { name: 'Email', value: 7 },
]
