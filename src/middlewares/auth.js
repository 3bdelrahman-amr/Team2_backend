const jwt = require('jsonwebtoken')
const config = require('config')
exports.checkAuth = function (req, res, next) {
    let token
    if (req.headers && req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token || !jwt.verify(token, config.get('JWT_KEY'))) {
        next(res.status(401).json({ message: 'User is not authorized' }))
    }
    next()
}
