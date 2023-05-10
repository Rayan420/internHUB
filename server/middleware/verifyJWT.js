const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      maxAge: '120m', // specify the maximum age of the token (10 minutes in this example)
    });
    req.email = decoded.email; // Add the decoded email to the request object
    req.role = decoded.role; // Add the decoded role to the request object
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }
};

module.exports = verifyJWT;
