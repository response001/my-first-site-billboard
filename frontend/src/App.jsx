import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './services/CartContext';
import { LanguageProvider } from './services/LanguageContext';
import { getAuth } from './services/api';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Services from './pages/Services';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Internship from './pages/Internship';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminLogin from './admin/Login';
import AdminLayout from './admin/Layout';
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminOrders from './admin/Orders';
import AdminInternship from './admin/Internship';
import AdminCourses from './admin/Courses';
import AdminMessages from './admin/Messages';
import AdminReports from './admin/Reports';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function RequireAdmin({ children }) {
  const { user, token } = getAuth();
  if (!token || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetails />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="internship" element={<AdminInternship />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          </Routes>
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
