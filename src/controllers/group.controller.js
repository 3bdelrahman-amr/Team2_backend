const mongoose = require('mongoose');
const { Group } = require('../models/groups.model');
const { Photo } = require('../models/photo.model');
const { UserModel: User } = require('../models/user.model');
/**
 * A function that creates a new group
 *
 * @function
 * @author Mostafa Omar
 * @summary Create a group
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group name parameter
 * @throws 500 Group already exists
 */
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
    groupInserted = await Group.findOne({
      name: groupName,
    }).exec();
    groupId = groupInserted._id;
    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        Group: groupId,
      },
    });
    res.status(200).json({
      message: 'Group created successfully',
    });
  }
};
/**
 * A function that fetches a group by ID
 *
 * @function
 * @author Mostafa Omar
 * @summary Fetch a group by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
/**
 * A function that lets the user join a group
 *
 * @function
 * @author Mostafa Omar
 * @summary Join a group
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
/**
 * A function that lets the user leave a group
 *
 * @function
 * @author Mostafa Omar
 * @summary Leave a group
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
/**
 * A function that lets the user get group photos
 *
 * @function
 * @author Mostafa Omar
 * @summary Get group photos
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
/**
 * A function that lets the user get group members
 *
 * @function
 * @author Mostafa Omar
 * @summary Get group members
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
      member.ref.num_following = member.ref.Followers.length;
      delete member.ref.Photos;
      delete member.ref.Followers;
      delete member.ref.__v;
      delete member.ref.Password;
      delete member.ref.Age;
      delete member.ref.isActive;
      delete member.ref.views;
      delete member.ref.About;
      delete member.ref.Date_joinedt;
      finalArray.push(member.ref);
    });
    res.status(200).json(finalArray);
  }
};
/**
 * A function that lets the user add a photo to the group
 *
 * @function
 * @author Mostafa Omar
 * @summary Add a photo to group
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 422 Missing group parameter
 * @throws 500 Invalid group ID
 * @throws 404 Group not found
 */
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
/**
 * A function that lets the user search for groups by a keyword
 *
 * @function
 * @author Mostafa Omar
 * @summary Search for groups
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 404 Group not found
 */
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
