const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const { Server } = require('socket.io');



const app = express();
const server = require('http').createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});


// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // optional, if custom views path

// Routes
const UserRoutes = require('./routes/UserRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const WishlistRoutes = require('./routes/WishlistRoutes');
const CartRoutes = require('./routes/CartRoutes');
const NotificationRoutes = require('./routes/NotificationRoutes');
const BuyNowForMeRoutes = require('./routes/BuyNowForMeRoutes');
const ProfileRoutes = require('./routes/ProfileRoutes');


app.use('/api/user', UserRoutes);
app.use('/api/product', ProductRoutes);
app.use('/api/wishlist',WishlistRoutes)
app.use('/api/cart',CartRoutes)
app.use('/api/notification',NotificationRoutes)
app.use('/api/buynowforme', BuyNowForMeRoutes);
app.use('/api/profile', ProfileRoutes); // Profile routes



// Connect to MongoDB and start the server with socket.io 
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


