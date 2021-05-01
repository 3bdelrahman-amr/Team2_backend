const jwt = require('jsonwebtoken')
const config = require('config')
exports.checkAuth = function (req, res, next) {
    let token
    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return next(res.status(401).json({ message: 'User is not authorized' }))
    }
    try {
        jwt.verify(token, config.get('JWT_KEY'))
    } catch (e) {
        return next(res.status(400).json({ message: 'Token invalid' }))
    }
    next()
}
