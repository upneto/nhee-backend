const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Ler token do cookie ao invés do header Authorization
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
