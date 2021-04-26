const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema(
    {
        Members: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        },
        Photos: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Photo' }]
        },
        name: {
          type: String,
          minlength: 1,
          maxlength: 30,
          required: true,
          trim: true
        },
        created_at: {
          type: String,
          match: /^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)((1)[5-9]\d{2}|(2)(0)[0-1][0-9]|2020)$/,
          required: true
        }
      },
      {
        toJSON: {
          virtuals: true
        },
        toObject: {
          virtuals: true
        }
      }
)
const Group = mongoose.model('Group', groupSchema);

module.exports = { Group, groupSchema };