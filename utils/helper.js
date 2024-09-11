const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};

const generateCodeVerificationExpDateTime = () => {
  const now = new Date();
  const expirationTime = 3 * 60 * 1000; // 3 minutes in milliseconds
  return now.getTime() + expirationTime;
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

const isCodeExpired = (dateTime) => {
    // new Date().getTime() is current time
    // new Date(+dateTime).getTime() is when code expires:  current time + 3 minutes
    return new Date(+dateTime).getTime() < new Date().getTime();
}

module.exports = {
  generateToken,
  generateCodeVerificationExpDateTime,
  generateVerificationCode,
  isCodeExpired
};
