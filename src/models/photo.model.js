const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PhotoSchema = new Schema({
    title: {
        type: String,
        min: 1,
        required: true,
    },
    description: {
        type: String,
        min: 1,
        required: true,
    },
    url: {
        type: String,
        min: 1,
        required: true,
    },
    Fav: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            unique: true,
        },
    ],
})
Photo = mongoose.model('Photo', PhotoSchema)
module.exports = { Photo, PhotoSchema }
