const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if token doesn't exist
  if (!token) {
    // FIX: Added 'return' to stop the function here.
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // 3. If a token exists, try to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    // FIX: It's good practice to return here as well.
    return res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
