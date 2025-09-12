import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppProvider } from './contexts/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetails from './pages/productDetails'
import Checkout from './pages/checkout'
import OrderSuccess from './pages/orderSuccess'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
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
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/products/details' element={<ProductDetails />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/order-success' element={<OrderSuccess />} />

            {/* Auth Routes */}
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />

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
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App
