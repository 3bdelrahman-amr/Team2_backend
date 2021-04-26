const mongoose = require('mongoose')
const favsSchema = new mongoose.Schema(
    {
        User: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        },
        Photo: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
        },
        created_at: {
            type: String,
            match: /^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)((1)[5-9]\d{2}|(2)(0)[0-1][0-9]|2020)$/,
            //required: true
        },
    },
    {
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
