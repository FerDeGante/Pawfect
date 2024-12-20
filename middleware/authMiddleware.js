const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization Header is required' })
  }

  const [bearer, token] = authHeader.split(' ')

  if (bearer !== 'Bearer') {
    return res.status(400).json({ message: 'Invalid Authorization Header format' })
  }

  if (!token) {
    return res.status(401).json({ message: 'Token is required' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    const now = Date.now() / 1000
    if (payload.exp <= now) {
      return res.status(403).json({ message: 'Token Expired' })
    }

    req.user = {
      id: payload.user_id,
      email: payload.email,
      role: payload.role
    }

    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid Token', error: error.message })
  }
}

const isAdminOrOwner = (req, res, next) => {
  // Verifica si el usuario es admin o propietario
  if (req.user.role !== 'admin' && req.user.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied: Admins and Owners only' })
  }
  next()
}

const isAdminOrEmployee = (req, res, next) => {
  // Verifica si el usuario es admin o empleado
  if (req.user.role !== 'admin' && req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Access denied: Admins and Employees only' })
  }
  next()
}

module.exports = { isAuth, isAdminOrOwner, isAdminOrEmployee }
