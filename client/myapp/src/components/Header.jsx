import React, { useState, useEffect, use } from "react";
import logo from "/images/website-logo.png";
import {
  SearchOutlined,
  AddShoppingCartOutlined,
  FavoriteBorder,
  StorefrontOutlined,
  AccountCircle,
  NotificationsNone,
  Menu,
  Close
} from "@mui/icons-material";
import { getUserProfile, logout } from '../features/UserFeature';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { io } from "socket.io-client";
import { getNotification } from "../features/NotificationFeature";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const wishProducts = useSelector((state) => state.wishlist.items);
  const cartProducts = useSelector((state) => state.cart.cart) || [];
  const notifications = useSelector((state) => state.notification.notifications);
  const user = useSelector((state) => state.user.profile);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getNotification());
    const socket = io("http://localhost:5001", { withCredentials: true });
    socket.on("new-notification", () => {
      dispatch(getNotification());
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getUserProfile());
  },[dispatch])

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/home/searchproduct?query=${encodeURIComponent(searchTerm.trim())}&limit=50&page=1`);
      setMobileMenuOpen(false);
    }
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <header className="w-full h-20 px-6 flex items-center justify-between shadow-sm relative">
      {/* Logo */}
      <div className="flex items-center gap-x-5">
        <img src={logo} alt="logo" className="w-14 h-14" />
        <h1 className="text-2xl font-bold">Drop Shipping</h1>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex w-[50%] h-10 border-2 border-gray-200 rounded-md relative"
      >
        <input
          value={searchTerm}
          type="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products"
          className="w-full h-full pl-2 rounded-md rounded-r-none outline-none"
        />
        <button
          type="submit"
          className="absolute right-0 w-10 h-10 bg-gray-300 flex items-center justify-center rounded-md rounded-l-none"
          aria-label="Search"
        >
          <SearchOutlined />
        </button>
      </form>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-x-5 relative ">
        <Link to={'/home/wishlist'} className="relative">
          <FavoriteBorder />
          {wishProducts.length > 0 && (
            <span className="absolute top-0 left-3 w-5 text-sm text-white h-5 bg-red-500 rounded-full flex items-center justify-center">{wishProducts.length}</span>
          )}
        </Link>
        <Link to={'/home/cart'} className="relative">
          <AddShoppingCartOutlined />
          {cartProducts.length > 0 && (
            <span className="absolute -top-2 left-[13%] w-5 text-sm text-white h-5 bg-red-500 rounded-full flex items-center justify-center">{cartProducts.length}</span>
          )}
        </Link>
        <Link to={'/home/usernotification'} className="relative">
          <NotificationsNone />
          {hasUnread && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-400 rounded-full blur-[1px]"></span>}
        </Link>
          <Link to={'/home/becomevendor'}>
        <span className="flex items-center gap-x-1 cursor-pointer w-auto h-10 border-2 border-gray-200 p-2 rounded-3xl">
          Become a Seller <StorefrontOutlined />
        </span>
        </Link>

        {/* Desktop Account Dropdown */}
        <div className="relative group">
          <span className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-full cursor-pointer overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <AccountCircle className="w-full h-full" />
            )}
          </span>
          <div className="absolute top-12 right-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
            <ul className="flex flex-col items-start py-2">
              <Link to={'/home/userprofile'}><li className="px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">Profile</li></Link>
              <Link to={'/home/userorder'}><li className="px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">Orders</li></Link>
              {user?.role === 'seller' &&
              <Link to={'/home/earning'} >
              <li className="px-4 py-2 hover:bg-gray-100 w-full cursor-pointer">Earning</li>
              </Link>
               }
              <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 text-red-600 w-full cursor-pointer">Logout</li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <Close /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white shadow-md z-50 p-4 flex flex-col gap-y-4 md:hidden">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full h-10 border-2 border-gray-200 rounded-md relative"
          >
            <input
              value={searchTerm}
              type="search"
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for products"
              className="w-full h-full pl-2 rounded-md rounded-r-none outline-none"
            />
            <button
              type="submit"
              className="absolute right-0 w-10 h-10 bg-gray-300 flex items-center justify-center rounded-md rounded-l-none"
              aria-label="Search"
            >
              <SearchOutlined />
            </button>
          </form>

          <Link to={'/home/wishlist'} className="relative flex items-center gap-x-2">
            <FavoriteBorder /> Wishlist
            {wishProducts.length > 0 && (
              <span className="absolute top-[21%] left-5 w-5 text-sm text-white h-5 bg-red-500 rounded-full flex items-center justify-center">{wishProducts.length}</span>
            )}
          </Link>
          <Link to={'/home/cart'} className="relative flex items-center gap-x-2">
            <AddShoppingCartOutlined /> Cart
            {cartProducts.length > 0 && (
              <span className="absolute top-[35%] left-5 w-5 text-sm text-white h-5 bg-red-500 rounded-full flex items-center justify-center">{cartProducts.length}</span>
            )}
          </Link>
          <Link to={'/home/usernotification'} className="relative flex items-center gap-x-2">
            <NotificationsNone /> Notifications
            {hasUnread && <span className="absolute left-6 top-1 w-2.5 h-2.5 bg-blue-400 rounded-full blur-[1px]"></span>}
          </Link>
          <Link to={'/home/becomevendor'} >
          <span className="flex items-center gap-x-2">
            Become a Seller <StorefrontOutlined />
          </span>
          </Link>

          {/* Mobile Account */}
          <div className="flex flex-col mt-2">
            <span
              className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-full cursor-pointer overflow-hidden"
              onClick={() => setMobileAccountOpen(!mobileAccountOpen)}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <AccountCircle className="w-full h-full" />
              )}
            </span>
            {mobileAccountOpen && (
              <ul className="mt-2 border border-gray-200 rounded-md shadow-lg bg-white">
                <Link to={'/home/userprofile'}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li></Link>
                <Link to={'/home/userorder'}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Orders</li></Link>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer">Logout</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
