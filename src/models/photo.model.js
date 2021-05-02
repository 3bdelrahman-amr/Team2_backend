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
    privacy:{
        type:String,
        enum:['Public','Private','Friends'],
        default:'Public',
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'

    }
})
Photo = mongoose.model('Photo', PhotoSchema)
module.exports = { Photo, PhotoSchema }
