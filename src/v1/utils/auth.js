const jwt = require('jsonwebtoken');
const sessions = require('./sessions');
const { JWT_SECRET_KEY, JWT_EXPIRATION } = require('../../config/config');
const { v4: uuidv4 } = require('uuid');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    const { session_id } = decoded;

    const session = sessions.find(s => s.session_id === session_id);
    if (!session) {
      return res.status(403).json({ message: 'Session not found or expired' });
    }

    req.user = { id: session.user_id };

    next();
  });
};

const generateToken = (user_id) => {
  const session_id = uuidv4();

  sessions.push({ session_id, user_id });

  const payload = { session_id };
  const accessToken = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRATION });
  return accessToken;
}

module.exports = { verifyToken, generateToken }; 