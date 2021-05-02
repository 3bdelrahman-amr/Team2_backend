const jwt = require('jsonwebtoken')
const User = require('../models/user.model')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    
        if (!user) {
            throw new Error()
        }

        req.token = token
        res.locals.userid = user._id;
        next()

    } catch (error) {
        res.status(401).send({ error: "User is not authorized to create album"})
    }
};

module.exports = auth
