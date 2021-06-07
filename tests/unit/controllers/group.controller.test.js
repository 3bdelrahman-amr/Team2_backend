const groupController = require('../../../src/controllers/group.controller');
const { Photo, Group } = require('../../../src/models');
const { UserModel: User } = require('../../../src/models/user.model');
const config = require('config');
const mongoose = require('mongoose');
describe('Groups Controller create group', () => {
  let req;
  let next;
  let res;
  beforeEach(async () => {
    await mongoose.connect(config.get('db'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    await mongoose.connection.dropDatabase();
    req = { headers: {}, params: {}, body: {} };
    res = {
      locals: {
        userid: '608834536de13632903701b7',
      },
      response: null,
      statusCode: 0,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.response = data;
        Object.freeze(this);
      },
    };
    user = new User({
      _id: '608834536de13632903701b7',
      Email: 'test@test.com',
      UserName: 'test',
      Fname: 'test',
      Lname: 'test',
      username: 'test',
      about: 'test',
      date_joined: Date.now(),
      Age: 50,
      Password: '123456',
      Fav: [],
      Group: [mongoose.Types.ObjectId('608834536de13632903701b6')],
    });
    photo = new Photo({
      _id: '608834536de13632903701b7',
      title: 'Test photo',
      description: '3432',
      privacy: 'public',
      tags: ['fun', 'adventure'],
      ownerId: mongoose.Types.ObjectId('608834536de13632903701b7'),
      photoUrl: 'http://test.com/img.jpg',
    });
    group = new Group({
      _id: '608834536de13632903701b7',
      name: 'test_group',
      description: 'test',
      privacy: 'public',
      visibility: 'public',
      Photos: [mongoose.Types.ObjectId('608834536de13632903701b7')],
    });
    privateGroup = new Group({
      _id: '608834536de13632903701b6',
      name: 'test_group2',
      description: 'test',
      privacy: 'private',
      visibility: 'invite',
      Members: [
        {
          ref: mongoose.Types.ObjectId('608834536de13632903701b7'),
          role: 'admin',
        },
      ],
    });
    thirdGroup = new Group({
      _id: '608834536de13632903701b5',
      name: 'test_group3',
      description: 'test',
      privacy: 'public',
      visibility: 'public',
      Members: [
        {
          ref: mongoose.Types.ObjectId('608834536de13632903701b7'),
          role: 'member',
        },
      ],
    });
    await photo.save();
    await group.save();
    await privateGroup.save();
    await thirdGroup.save();
    await user.save();
  });
  describe('Get a group with invalid id', () => {
    it('Should Fail when invalid id used', async () => {
      req.params.group_id = '10';
      await groupController.getGroup(req, res);
      expect(res.statusCode).toBe(500);
      expect(res.response.message).toBe('Invalid group ID');
    });
  });
  describe('Get a group with no id', () => {
    it('Should Fail when no group ID specified', async () => {
      await groupController.getGroup(req, res);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Get a group successfully', () => {
    it('Should successfully fetch a group', async () => {
      req.params.group_id = '608834536de13632903701b7';
      await groupController.getGroup(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
  describe('Get a group with incorrect id', () => {
    it('Should fail as id doesnt exist', async () => {
      req.params.group_id = '608834536de13632903701b3';
      await groupController.getGroup(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  describe('Get a group which is private', () => {
    it('Should fail as group is private and user is not a member', async () => {
      req.params.group_id = '608834536de13632903701b6';
      await groupController.getGroup(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  describe('Create a new group with no group name', () => {
    it('Should Fail when no group name is set', async () => {
      await groupController.createGroup(req, res);
      expect(res.statusCode).toBe(422);
      expect(res.response.message).toBe('Missing group name parameter');
    });
  });
  describe('Create a new group which already exists', () => {
    it('Should Fail when group name is already used', async () => {
      req.body.group_name = 'test_group';
      await groupController.createGroup(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
  describe('Create a new group successfully', () => {
    it('Should create a new group successfully', async () => {
      req.body.group_name = 'test_group_edited';
      await groupController.createGroup(req, res);
      expect(res.statusCode).toBe(200);
    });
  });
  /**/
  describe('Join a group with invalid id', () => {
    it('Should Fail when invalid id used', async () => {
      req.params.group_id = '10';
      await groupController.join(req, res);
      expect(res.statusCode).toBe(500);
      expect(res.response.message).toBe('Invalid group ID');
    });
  });
  describe('Join a group with no id', () => {
    it('Should Fail when no group ID specified', async () => {
      await groupController.join(req, res);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Join a group successfully', () => {
    it('Should successfully let the user join a group', async () => {
      req.params.group_id = '608834536de13632903701b7';
      await groupController.join(req, res);
      const user = await User.findById('608834536de13632903701b7');
      expect(user.Group[1]).toEqual(
        mongoose.Types.ObjectId('608834536de13632903701b7')
      );
    });
  });
  describe('Join a group that the user is already a member of', () => {
    it('Should fail as the user is already a member of the group', async () => {
      req.params.group_id = '608834536de13632903701b6';
      const group = await groupController.join(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
  describe('Join a group that doesnt exist', () => {
    it('Should fail as the group doesnt exist', async () => {
      req.params.group_id = '608834536de13632903701b0';
      const group = await groupController.join(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  //
  describe('Leave a group with no id', () => {
    it('Should Fail when no group ID specified', async () => {
      await groupController.leave(req, res);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Leave a group successfully', () => {
    it('Should successfully let the user leave a group', async () => {
      req.params.group_id = '608834536de13632903701b6';
      await groupController.leave(req, res);
      const user = await User.findById('608834536de13632903701b7');
      expect(user.Group.toObject()).toStrictEqual([]);
    });
  });
  describe('Leave a group that the user is not a member of', () => {
    it('Should fail as the user is not a member of the group', async () => {
      req.params.group_id = '608834536de13632903701b7';
      const group = await groupController.leave(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
  describe('Leave a group that doesnt exist', () => {
    it('Should fail as the group doesnt exist', async () => {
      req.params.group_id = '608834536de13632903701b0';
      const group = await groupController.leave(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  //
  describe('Get group photos with no id', () => {
    it('Should Fail when no group ID specified', async () => {
      await groupController.getGroupPhotos(req, res);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Get group photos with incorrect id', () => {
    it('Should Fail when incorrect group ID specified', async () => {
      req.params.id = '10';
      await groupController.getGroupPhotos(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
  describe('Get group photos successfully', () => {
    it('Should successfully fetch group photos', async () => {
      req.params.id = '608834536de13632903701b7';
      await groupController.getGroupPhotos(req, res);
      expect(res.response[0]._id.toString()).toMatch(
        '608834536de13632903701b7'
      );
    });
  });
  describe('Get group photos of non existing group', () => {
    it('Should fail as the group doesnot exist', async () => {
      req.params.id = '608834536de13632903701b0';
      await groupController.getGroupPhotos(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  //
  describe('Get group members with no id', () => {
    it('Should Fail when no group ID specified', async () => {
      await groupController.getGroupMembers(req, res);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Get group members with incorrect id', () => {
    it('Should Fail when incorrect group ID specified', async () => {
      req.params.id = '10';
      await groupController.getGroupMembers(req, res);
      expect(res.statusCode).toBe(500);
    });
  });
  describe('Get group members successfully', () => {
    it('Should successfully fetch group members', async () => {
      req.params.id = '608834536de13632903701b5';
      await groupController.getGroupMembers(req, res);
      expect(res.response[0]._id.toString()).toMatch(
        '608834536de13632903701b7'
      );
    });
  });
  describe('Get group members of non existing group', () => {
    it('Should fail as the group doesnot exist', async () => {
      req.params.id = '608834536de13632903701b0';
      await groupController.getGroupMembers(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
  //
  describe('Add photo to group successfully', () => {
    it('Should successfully add a photo to group', async () => {
      req.body.photo_id = '608834536de13632903701b7';
      req.body.group_id = '608834536de13632903701b5';
      await groupController.addPhoto(req, res);
      const group = await Group.findById(req.body.group_id);
      expect(group.Photos[0]._id.toString()).toBe('608834536de13632903701b7');
    });
  });
  describe('Add photo to group without group id', () => {
    it('Should fail as no group given', async () => {
      await groupController.addPhoto(req, res);
      const group = await Group.findById(req.body.group_id);
      expect(res.statusCode).toBe(422);
    });
  });
  describe('Add photo to group without photo id', () => {
    it('Should fail as no photo given', async () => {
      req.body.group_id = '608834536de13632903701b5';
      await groupController.addPhoto(req, res);
      const group = await Group.findById(req.body.group_id);
      expect(res.statusCode).toBe(404);
    });
  });
  //
  describe('Search group successfully', () => {
    it('Should successfully get group search results', async () => {
      req.params.keyword = '3';
      await groupController.searchGroup(req, res);
      expect(res.response[0].name).toMatch('test_group3');
    });
  });
});
