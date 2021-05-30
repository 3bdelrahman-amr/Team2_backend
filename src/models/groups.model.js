const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema(
  {
    Members: [
      {
        ref: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        role: {
          type: String,
          default: 'member',
        },
        _id: false,
      },
    ],
    Photos: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }],
    },
    name: {
      type: String,
      minlength: 1,
      maxlength: 30,
      required: true,
    },
    description: {
      type: String,
      minlength: 1,
      maxlength: 100,
      default: null,
    },
    privacy: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    visibility: {
      type: String,
      enum: ['public', 'invite'],
      default: 'public',
    },
    createdAt: {
      type: Date,
      required: true,
      min: '2021-01-1',
      default: Date.now,
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
);
const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };
