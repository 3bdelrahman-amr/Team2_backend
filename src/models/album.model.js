const mongoose = require('mongoose');
const Photo = require("./photo.model");

const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    photos:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Photo'
    }]

}, {
    timestamps: true
});

// albumSchema.virtual('photos',{
//     ref: 'Photo',
//     localField: '_id',
//     foreignField: 'albums_ids'
// })

const Album = mongoose.model('Album', albumSchema);


module.exports = Album