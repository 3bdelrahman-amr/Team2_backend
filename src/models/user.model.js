const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    Fname: {
        type: String,
        min: 1,
        required: true,
    },
    Lname: {
        type: String,
        min: 1,
        required: true,
    },
    username: {
        type: String,
        min: 1,
        required: true,
    },
    email: {
        type: String,
        min: 1,
        required: true,
    },
    about: {
        type: String,
        min: 1,
        required: true,
    },

    age: {
        type: Number,
        min: 1,
        required: true,
    },

    date_joined: {
        type: Date,
        required: true,
        min: '2021-01-1',
    },

    photos: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo',
        },
    ],

    num_tags: {
        type: Number,
        min: 0,
    },

    num_view: {
        type: Number,
        min: 0,
    },

    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],

    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    Group: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Group',
        },
    ],
    Album: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Album',
        },
    ],
    Gallery: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Gallery',
        },
    ],
    Avatar: {
        type: Schema.Types.ObjectId,
        ref: 'Photo',
    },
    Fav: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Photo',
        },
    ],
    Groups: [
        {
            ref: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
            role: {
                type: String,
                default: 'member',
            },
            _id: false,
        },
    ],
})
User = mongoose.model('User', UserSchema)
module.exports = { User, UserSchema }
