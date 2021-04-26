const mongoose = require('mongoose')
const favsSchema = new mongoose.Schema(
    {
        User: {
            type: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        },
        Photo: {
            type: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo' },
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
)
const Fav = mongoose.model('Fav', favsSchema)

module.exports = { Fav, favsSchema }
