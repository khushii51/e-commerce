import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  
  const authHeader = req.header('Authorization')  ;
  let token = authHeader && authHeader.replace(/^Bearer\s+/i, '');

  if (!token && req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) return res.status(401).json({ error: 'No token provided or Bearer filed empty!' });

  try {
 
    const secret = process.env.JWT_ACCESS_SECRET ;
    if (!secret) return res.status(500).json({ message: "Internal server error!,", error: message.error });

    const verified = jwt.verify(token, secret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;
