require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyTokenFromHeader = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Check if token exists in headers and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1]; // Get the token part after 'Bearer'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user to request
    next(); // Proceed to next middleware
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = verifyTokenFromHeader;
