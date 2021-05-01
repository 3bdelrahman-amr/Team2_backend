const mongoose = require('mongoose');

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

}, {
    timestamps: true
});

albumSchema.virtual('photos',{
    ref: 'photo',
    localField: '_id',
    foreignField: 'owner_albums'
})

const Album = mongoose.model('Album', albumSchema);


module.exports = Album