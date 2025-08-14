const jwt = require('jsonwebtoken');
require('dotenv').config();

const UserTokenVerify = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.redirect('/');
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.redirect('/');
  }
};

module.exports = UserTokenVerify;
