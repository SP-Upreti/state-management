import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetails from './pages/productDetails'
import Checkout from './pages/checkout'
import OrderSuccess from './pages/orderSuccess'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductDetails from './pages/admin/AdminProductDetails'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCategories from './pages/admin/AdminCategories'
import AdminAnalytics from './pages/admin/AdminAnalytics'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/details' element={<ProductDetails />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/order-success' element={<OrderSuccess />} />

          {/* Admin Routes */}
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path='products' element={<AdminProducts />} />
            <Route path='products/:id' element={<AdminProductDetails />} />
            <Route path='users' element={<AdminUsers />} />
            <Route path='orders' element={<AdminOrders />} />
            <Route path='categories' element={<AdminCategories />} />
            <Route path='analytics' element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
