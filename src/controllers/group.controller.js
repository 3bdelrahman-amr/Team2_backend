const mongoose = require('mongoose');
const { Group } = require('../models/groups.model');

exports.createGroup = async function (req, res) {
  const userId = res.locals.userid;
  const groupName = req.body.group_name;
  const group = await Group.findOne({ name: groupName }).exec();
  if (!groupName) {
    res.status(422).json({ message: 'Missing group name parameter' });
  } else if (group) {
    res.status(500).json({ message: 'Group already exists' });
  } else {
    await Group.create({
      name: groupName,
      Members: { ref: userId, role: 'admin' },
    });
    res.status(200).json({
      message: 'Group created successfully',
    });
  }
};

exports.getGroup = async function (req, res) {
  const userId = res.locals.userid;
  const groupId = req.params.group_id;
  let group;
  try {
    group = await Group.findById(groupId).lean().exec();
  } catch (err) {
    return res.status(500).json({ message: 'Invalid group ID' });
  }
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group || (group && group.privacy === 'private')) {
    res.status(404).json({ message: 'Group not found' });
  } else {
    const number = await Group.find({
      _id: groupId,
      Members: {
        $elemMatch: { ref: userId },
      },
    }).exec();
    if (number.length > 0) {
      const memberRole = await Group.aggregate([
        {
          $match: { _id: { $eq: mongoose.Types.ObjectId(groupId) } },
        },
        {
          $unwind: '$Members',
        },
        {
          $match: {
            'Members.ref': { $eq: mongoose.Types.ObjectId(userId) },
          },
        },
        {
          $project: {
            ref: '$Members.ref',
            role: '$Members.role',
          },
        },
      ]).exec();
      delete group.Members;
      delete group.Photos;
      group.role = memberRole[0].role;
    }
    res.status(200).json(group);
  }
};

exports.join = async function (req, res) {
  const groupId = req.params.group_id;
  const userId = res.locals.userid;
  const user = await User.findById(userId).exec();
  try {
    const group = await Group.findById(groupId).lean().exec();
  } catch (err) {
    return res.status(500).json({ message: 'Invalid group ID' });
  }
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group) {
    res.status(404).json({ message: 'Group not found' });
  } else {
    const number = await Group.find({
      _id: groupId,
      Members: {
        $elemMatch: { ref: userId },
      },
    }).exec();
    if (number.length > 0) {
      return res.status(500).json({
        message: 'User is already a member of the group',
      });
    }
    await Group.findByIdAndUpdate(groupId, {
      $addToSet: {
        Members: {
          ref: userId,
          role: 'member',
        },
      },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        Groups: {
          ref: groupId,
          role: 'member',
        },
      },
    });
    res.status(200).json({
      message: 'User added to group successfully',
    });
  }
};

exports.leave = async function (req, res) {
  const groupId = req.params.group_id;
  const userId = res.locals.userid;
  const user = await User.findById(userId).exec();
  const group = await Group.findById(groupId).exec();
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group) {
    res.status(404).json({ message: 'Group not found' });
  } else {
    const number = await Group.find({
      _id: groupId,
      Members: {
        $elemMatch: { ref: userId },
      },
    }).exec();
    if (number.length === 0) {
      return res.status(500).json({
        message: 'User not a member in the group',
      });
    }
    await Group.findByIdAndUpdate(groupId, {
      $pull: {
        Members: {
          ref: userId,
        },
      },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: {
        Groups: {
          ref: groupId,
          role: 'member',
        },
      },
    });
    res.status(200).json({
      message: 'User left group successfully',
    });
  }
};

exports.getGroupPhotos = async function (req, res) {
  const userId = res.locals.userid;
  const groupId = req.params.id;
  let group;
  try {
    group = await Group.findById(groupId).lean().exec();
  } catch (err) {
    return res.status(500).json({ message: 'Invalid group ID' });
  }
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group || (group && group.privacy === 'private')) {
    res.status(404).json({ message: 'Group not found' });
  } else {
    const number = await Group.find({
      _id: groupId,
      Members: {
        $elemMatch: { ref: userId },
      },
    }).exec();
    if (number.length > 0) {
      const memberRole = await Group.aggregate([
        {
          $match: { _id: { $eq: mongoose.Types.ObjectId(groupId) } },
        },
        {
          $unwind: '$Members',
        },
        {
          $match: {
            'Members.ref': { $eq: mongoose.Types.ObjectId(userId) },
          },
        },
        {
          $project: {
            ref: '$Members.ref',
            role: '$Members.role',
          },
        },
      ]).exec();
      delete group.Members;
      group.role = memberRole[0].role;
    }
    res.status(200).json(group);
  }
};
