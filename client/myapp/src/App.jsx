import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import Seller from './pages/Seller';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute'; // Ensure default export
import AdminDashboard from './pages/AdminDashboard';
import { Upload } from '@mui/icons-material';
import ProductUpload from './pages/ProductUpload';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import SearchPage from './pages/SearchPage';
import ChooseOrder from './components/ChooseOrder';
import BuyNowForMe from './pages/BuyNowForMe';
import UserNotification from './pages/UserNotification';
import UserOrder from './pages/UserOrder';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />

       {/* Protected route for /home and its nested pages */}
      <Route path="/home" element={<ProtectedRoute allowedRoles={['user']} />}>
        {/* Default page on /home */}
        <Route index element={<Home/>} />
        <Route path='productdetail/:id' element={<ProductDetail/>} />
        <Route path='wishlist' element={<Wishlist/>} />
        <Route path='cart' element={<Cart/>} />
        <Route path='searchproduct' element={<SearchPage/>} />
        <Route path='choose-order/:id' element={<ChooseOrder/>} />
        <Route path='buy-now-for-me/:id' element={<BuyNowForMe/>} />
        <Route path='usernotification' element={<UserNotification/>} />
        <Route path='userorder' element={<UserOrder/>} />
        <Route path='userprofile' element={<UserProfile/>} />
      </Route>
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={['vendor']}>
              <Seller />
            </ProtectedRoute>
          }
        />
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Admin/>}>
          <Route  index  element={<AdminDashboard />} />
           <Route path='uploadproduct' element={<ProductUpload/>} />
        </Route>
      </Route>
          
          

      </Routes>
    
  );
};

export default App;
