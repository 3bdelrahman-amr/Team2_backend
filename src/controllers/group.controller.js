const mongoose = require('mongoose');
const { Group } = require('../models/groups.model');
const { Photo } = require('../models/photo.model');
const { UserModel: User } = require('../models/user.model');

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
      group.role = memberRole[0].role;
    }
    group.count_members = group.Members.length;
    group.count_photos = group.Photos.length;
    delete group.Members;
    delete group.Photos;
    res.status(200).json(group);
  }
};

exports.join = async function (req, res) {
  const groupId = req.params.group_id;
  const userId = res.locals.userid;
  let group;
  try {
    group = await Group.findById(groupId).lean().exec();
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
        Group: groupId,
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
        Group: groupId,
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
    group = await Group.findById(groupId).populate('Photos').lean().exec();
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
    res.status(200).json(group.Photos);
  }
};

exports.getGroupMembers = async function (req, res) {
  const groupId = req.params.id;
  let group;
  try {
    group = await Group.findById(groupId).populate('Members.ref').lean().exec();
  } catch (err) {
    return res.status(500).json({ message: 'Invalid group ID' });
  }
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group || (group && group.privacy === 'private')) {
    res.status(404).json({ message: 'Group not found' });
  } else {
    const members = group.Members;
    let finalArray = [];
    members.forEach(function (member) {
      member.ref.role = member.role;
      member.ref.email = member.ref.Email;
      delete member.ref.Email;
      member.ref.num_photos = member.ref.Photos.length;
      member.ref.num_following = member.ref.Followers.length;
      delete member.ref.Photos;
      delete member.ref.Followers;
      finalArray.push(member.ref);
    });
    res.status(200).json(finalArray);
  }
};

exports.addPhoto = async function (req, res) {
  const groupId = req.body.group_id;
  const photoId = req.body.photo_id;
  const group = await Group.findById(groupId).exec();
  const photo = await Photo.findById(photoId).exec();
  if (!groupId) {
    res.status(422).json({ message: 'Missing group parameter' });
  } else if (!group || !photo) {
    res.status(404).json({ message: 'Group/Photo not found' });
  } else {
    const number = await Group.find({
      _id: groupId,
      Photos: {
        $elemMatch: { $eq: photoId },
      },
    }).exec();
    if (number.length > 0) {
      return res.status(500).json({
        message: 'Photo is already in Group',
      });
    }
  }
  await Group.findByIdAndUpdate(groupId, {
    $addToSet: { Photos: photoId },
  });
  res.status(200).json({
    group_id: groupId,
  });
};

exports.searchGroup = async function (req, res) {
  const searchKeyword = req.params.keyword;
  const userId = res.locals.userid;
  if (!searchKeyword) {
    res.status(404).json({ message: 'Group not found' });
  }
  const groups = await Group.find({
    name: { $regex: searchKeyword, $options: 'i' },
  }).exec();
  let finalArray = [];
  groups.forEach(async function (group) {
    let gp = JSON.parse(JSON.stringify(group));
    gp.num_photos = group.Photos.length;
    gp.num_members = group.Members.length;
    delete gp.Photos;
    gp.Members.find(function (member) {
      if (member.ref == userId) gp.role = member.role;
      return;
    });
    delete gp.Members;
    finalArray.push(gp);
  });
  res.status(200).json(finalArray);
};
