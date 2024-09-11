const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer token
  if (!token) { 
    return res.status(401).json({ message: 'Token required' });
  }

  if (req.url.startsWith('/auth')) {
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
        
        if(err.message.includes('expired')) {
            return res.status(403).json({ message: 'expiredToken' });
        } else {
            return res.status(403).json({ message: 'invalidToken' });
        }
    }
    req.user = user; // Attach the decoded user information to the request object
    next();
  });
};

module.exports = {
  authenticateToken
}