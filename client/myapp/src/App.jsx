import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Keep normal import for wrappers
import BuyNowForSomeone from './pages/BuyNowForSomeone';
import SellerInformation from './components/SellerInformation';
import BecomeVendor from './pages/BecomeVendor';
import AdminCategories from './pages/AdminCategories';
import PendingVendors from './pages/PendingVendors';
import ProceedtoMe from './pages/ProceedtoMe';
import ProceedToSomeone from './pages/ProceedToSomeone';



// Lazy-loaded components
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductUpload = lazy(() => import('./pages/ProductUpload'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Cart = lazy(() => import('./pages/Cart'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ChooseOrder = lazy(() => import('./components/ChooseOrder'));
const BuyNowForMe = lazy(() => import('./pages/BuyNowForMe'));
const UserNotification = lazy(() => import('./pages/UserNotification'));
const UserOrder = lazy(() => import('./pages/UserOrder'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const AdminUsers = lazy(() => import('./pages/AdminUsers'));
const AdminDashboardLayout = lazy(() => import('./pages/AdminDashboardLayout'));
const PendingVendorDetails = lazy(() => import('./pages/PendingVendorDetails'));
const Vendors = lazy(() => import('./pages/Vendors'));
const RejectedVendors = lazy(() => import('./pages/RejectedVendors'));
const BlockedVendors = lazy(() => import('./pages/BlockedVendors'));
const Vendor = lazy(() => import('./pages/Vendor'));
const AdminProducts = lazy(() => import('./pages/AdminProducts'));
const AdminItselfProducts = lazy(() => import('./pages/AdminItselfProducts'));
const AdminOrders = lazy(() => import('./pages/AdminOrders'));
const AdminYourOrders = lazy(() => import('./pages/AdminYourOrders'));
const DigiDokanLogin = lazy(() => import('./pages/DigiDokanLogin'));
const UserEarning = lazy(() => import('./pages/UserEarning'));
const Contact = lazy(() => import('./components/Contact'));
const About = lazy(() => import('./components/About'));
const AdminMessages = lazy(() => import('./components/AdminMessages'));
const Withdraw = lazy(() => import('./components/Withdraw'));
const AdminWithdraw = lazy(() => import('./pages/AdminWithdraw'));


const App = () => {
  return (
    <>
      {/* Suspense will show fallback while component is loading */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-xl font-bold">
            Loading...
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Signup />} />

          {/* Protected route for /home and nested pages */}
          <Route path="/home" element={<ProtectedRoute allowedRoles={['user', 'seller', 'admin', 'vendor']} />}>
            <Route index element={<Home />} />
            <Route path="productdetail/:id" element={<ProductDetail />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
            <Route path="searchproduct" element={<SearchPage />} />
            <Route path="choose-order/:id" element={<ChooseOrder />} />
            <Route path="buy-now-for-me/:id" element={<BuyNowForMe />} />
            <Route path="buy-now-for-someone/:id" element={<BuyNowForSomeone />} />
            <Route path="seller-information/:id" element={<SellerInformation />} />
            <Route path="usernotification" element={<UserNotification />} />
            <Route path="userorder" element={<UserOrder />} />
            <Route path="userprofile" element={<UserProfile />} />
            <Route path="becomevendor" element={<BecomeVendor />} />
            <Route path="proceed-to-me/:id" element={<ProceedtoMe />} />
            <Route path="proceed-to-someone/:id" element={<ProceedToSomeone />} />
            <Route path="earning" element={<UserEarning />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="withdraw" element={<Withdraw />} />
          </Route>

          {/* Vendor Protected Route */}
          <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
            <Route path="/vendor" element={<Vendor />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboardLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route path="uploadproduct" element={<ProductUpload />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="pending-vendors" element={<PendingVendors />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="pending-vendors/:id" element={<PendingVendorDetails />} />
              <Route path="rejected-vendors" element={<RejectedVendors />} />
              <Route path="blocked-vendors" element={<BlockedVendors />} />
              <Route path="all-products" element={<AdminProducts />} />
              <Route path="itself-products" element={<AdminItselfProducts />} />
              <Route path="all-orders" element={<AdminOrders />} />
              <Route path="your-orders" element={<AdminYourOrders />} />
              <Route path="book-orders" element={<DigiDokanLogin />} />
              <Route path="contact" element={<AdminMessages />} />
              <Route path="withdraw-management" element={<AdminWithdraw />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      </>
  );
};

export default App;
