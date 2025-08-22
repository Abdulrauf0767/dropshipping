const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO with CORS config
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React frontend URL
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// ✅ Express Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Routes
const UserRoutes = require('./routes/UserRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const WishlistRoutes = require('./routes/WishlistRoutes');
const CartRoutes = require('./routes/CartRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
const BuyNowForMeRoutes = require('./routes/BuyNowForMeRoutes');
const ProfileRoutes = require('./routes/ProfileRoutes');
const SellerRoutes = require('./routes/SellerRoutes');
const vendorRoutes = require('./routes/VendorRoutes');
const ProceedToCheckoutRoutes = require('./routes/ProceedToCheckoutRoutes');
const DigiRoutes = require('./routes/DigiRoutes');
const ContactRoutes = require('./routes/ContactRoutes');
const WithdrawRoutes = require('./routes/WithdrawRoutes');




app.use('/api/user', UserRoutes);
app.use('/api/product', ProductRoutes);
app.use('/api/wishlist', WishlistRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/notification', NotificationRoutes);
app.use('/api/buynowforme', BuyNowForMeRoutes);
app.use('/api/profile', ProfileRoutes);
app.use('/api/seller', SellerRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/proceedtocheckout', ProceedToCheckoutRoutes);
app.use('/api/digi',DigiRoutes);
app.use('/api/contact',ContactRoutes)
app.use('/api/withdraw',WithdrawRoutes)

// ✅ MongoDB Connection + Start Server
mongoose
  .connect(process.env.DBURL)
  .then(() => {
    console.log('✅ Database connected');
    server.listen(process.env.PORT, () => {
      console.log(`🚀 Server started at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });
