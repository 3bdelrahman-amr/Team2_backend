const mongoose = require('mongoose');
const Joi =require('joi');
Joi.objectId= require('joi-objectid')(Joi);


const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlenght: 1024
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});


const Comment = mongoose.model('comment', commentSchema);

const photoSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        default: "photo title",
        maxlength: 255
    },
    description: {
        type: String,
        required: true,
        default: "photo",
        maxlength: 1024
    },
    photoUrl: {
        type: String,
        required: true
    },
    privacy: {
        type: String,
        required: true,
        default: 'private',
        trim: true,
        enum: ['private', 'public']
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    tags: [{
        tag: {
            type: String,
            required: false,
            trim: true,
            maxlength: 50
        }
    }],
    comments: [{type:commentSchema}]
}, {
    timestamps: true
});

const Photo = mongoose.model('Photo', photoSchema);

function validatePhoto(photo){
    const schema = Joi.object({
        title: Joi.string().max(255),
        description:Joi.string().max(1024),
        photoUrl:Joi.string().required(),
        privacy:Joi.string().validate('private','public'),
        tags:Joi.array().items(Joi.string().max(50))

    });
    const result = schema.validate(photo);
    return result;

}


function validateComment(comment){
    const schema = Joi.object({
        comment: Joi.string().required().max(1024)
    });
    const result = schema.validate(comment);
    return result;

}

function validateId(id){
    const schema = Joi.object({
        id: Joi.objectId().required()
    });
    const result = schema.validate(id);
    return result;
}

exports.validateId = validateId;
exports.validatePhoto = validatePhoto;
exports.validateComment = validateComment;
module.exports.Photo = Photo;
module.exports.Comment = Comment;