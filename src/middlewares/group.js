const { Group } = require('../models/groups.model');

module.exports.isMember = async (req, res, next) => {
  let id = res.locals.userid;
  const number = await Group.find({
    _id: req.body.group_id,
    Members: {
      $elemMatch: { ref: id },
    },
  }).exec();
  if (number.length === 0) {
    return res
      .status(422)
      .json({ message: 'User is not a member of the group.' });
  }
  next();
};
