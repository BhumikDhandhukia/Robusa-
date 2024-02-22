// authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  console.log('MIDDLEWARE')
  
  const token = req.header('Authorization');
  


  if (!token) {
    console.log('NO TOKEN')
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    console.log(token)
    const decoded = jwt.verify(token, 'your_secret_key');
    console.log(decoded)
    
    const user = await UserModel.findOne({ _id: decoded.userId});

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
