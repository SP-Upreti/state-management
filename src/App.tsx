import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home'
import Products from './pages/products'
import ProductDetails from './pages/productDetails'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/details' element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
