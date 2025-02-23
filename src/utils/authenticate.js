const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = { verifyToken }; // Export as an object for clarity