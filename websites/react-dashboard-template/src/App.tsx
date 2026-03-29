/**
 * App Component - Main Application Router
 * =======================================
 * Sets up the main routing structure and layout.
 * Includes sidebar navigation and route definitions.
 */

import { Routes, Route } from 'react-router-dom'
import { DashboardLayout } from '@components/layout/DashboardLayout'
import { Dashboard } from '@pages/Dashboard'
import { Analytics } from '@pages/Analytics'
import { Users } from '@pages/Users'
import { Products } from '@pages/Products'
import { Settings } from '@pages/Settings'
import { NotFound } from '@pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
