const httpmocks = require('node-mocks-http');
const mongoose = require('mongoose');
const photoController = require('../../../src/controllers/photo.controller');
const { Photo } = require('../../../src/models/photo.model');
const { UserModel: User } = require('../../../src/models/user.model');
const { EXPECTATION_FAILED } = require('http-status');

const user1 = {
    _id: "608834536de13632903701b7",
    Email: 'Moustafa.Achraf@hotmail.com',
    UserName: 'test',
    Fname: 'test',
    Lname: 'test',
    username: 'test',
    about: 'test',
    Avatar: '609dda0c9a52002aa498bf01',
    date_joined: Date.now(),
    Age: 25,
    Password: 'mostafa123',
    Fav: [],

};

const user2 = {
    _id: "608834536de13632903701b6",
    Email: 'Omar.Achraf@hotmail.com',
    UserName: 'Omar',
    Fname: 'test',
    Lname: 'test',
    username: 'test',
    about: 'test',
    Avatar: '609dda0c9a52002aa498bf01',
    date_joined: Date.now(),
    Age: 25,
    Password: 'omar123',
    Fav: [],
};

const photo1 = {
    _id: "609dda0c9a52002aa498bf01",
    title: 'test',
    photoUrl: 'test',
    description: 'test',
    photoUrl: 'https://www.montanusphotography.com/coverphotos/WiscoyFalls-CharlotteNY-MontanusPhoto.jpg',
    Fav: [],
    privacy: 'public',
    ownerId: '608834536de13632903701b7',
}

const photo2 = {
    _id: "609dda0c9a52002aa498bf02",
    title: 'test',
    photoUrl: 'test',
    description: 'test',
    Fav: [],
    privacy: 'public',
    peopleTags:[{
        tagged:['608834536de13632903701b6'],
        tagging:'608834536de13632903701b7'
    }],
    ownerId: '608834536de13632903701b6'
}

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();

})

describe('explore', () => {
    beforeEach(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true

            });
        await User.deleteMany();
        await Photo.deleteMany();
        //creating a user to be the one that is logged in
        await new User(user1).save();
        await new User(user2).save();

        //adding photos to the user that will create the album
        await new Photo(photo1).save();
        await new Photo(photo2).save();

    });
    it('Should return 200 and array of 2 photos', async () => {
        // create fake response and request 
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        // set req body, here title is a required property so it willl fail
        res.locals.userid = user1._id;

        await photoController.getPhotosExplore(req,res);
        // Assertions about status code
        expect(res._getStatusCode()).toBe(200);

        // const result = res._getData();
        // console.log(result);
        // const response = await Photo.find();
        // expect(result).toMatchObject(response);

    });
});

describe('add tag people',  () => {
    beforeEach(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true

            });
        await User.deleteMany();
        await Photo.deleteMany();
        //creating a user to be the one that is logged in
        await new User(user1).save();
        await new User(user2).save();

        //adding photos to the user that will create the album
        await new Photo(photo1).save();
        await new Photo(photo2).save();

    });
    it('Should return 400 if array of tagged is empty', async () => {
        // create fake response and request 
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        // set req body, here title is a required property so it willl fail
        res.locals.userid = user1._id;
        req.body.tagged=[]


        await photoController.tagPeople(req,res);

        // Assertions about status code
        expect(res._getStatusCode()).toBe(400);



    });
    it('Should return 200 if successful', async () => {
        // create fake response and request 
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        // set req body, here title is a required property so it willl fail
        res.locals.userid = user1._id;
        req.body.tagged=['609dda0c9a52002aa498bf01']
        req.body.photos=['609dda0c9a52002aa498bf02']

        await photoController.tagPeople(req,res);

        // Assertions about status code
        expect(res._getStatusCode()).toBe(200);

    });
});

describe('remove tag people',  () => {
    beforeEach(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true

            });
        await User.deleteMany();
        await Photo.deleteMany();
        //creating a user to be the one that is logged in
        await new User(user1).save();
        await new User(user2).save();

        //adding photos to the user that will create the album
        await new Photo(photo1).save();
        await new Photo(photo2).save();

    });
    it('Should return 400 if array of tagged is empty', async () => {
        // create fake response and request 
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        // set req body, here title is a required property so it willl fail
        res.locals.userid = user1._id;
        req.body.tagged=[]
        req.params.id= photo1._id;


        await photoController.removeTagPeople(req,res);

        // Assertions about status code
        expect(res._getStatusCode()).toBe(400);



    });
    it('Should return 200 if successful', async () => {
        // create fake response and request 
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        // set req body, here title is a required property so it willl fail
        res.locals.userid = user1._id;
        req.body.tagged=['608834536de13632903701b6']
        req.params.id= photo2._id;

        await photoController.removeTagPeople(req,res);

        // Assertions about status code
        expect(res._getStatusCode()).toBe(200);
    });
});
describe('create new comment', () => {
    beforeAll(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
    
            });
        await mongoose.connection.dropDatabase();
        req = { headers: {}, params: {}, body: {} };
        res = {
          locals: {userid: '608834536de13632903701b7'},
          response: null,
          statusCode: 0,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.response = data;
          },
          send: ()=>{}
        };
        user = new User(user1);
        await user.save();
        photo = new Photo(photo1);
        await photo.save();
      });
    it('should return error 400 if photoId sent in params is invalid', async () => {

        // set comment data in request body
        req.body = {
            comment: 'Ahmed'
        }
        //set parameters sent in path
        req.params = {
            photoId: '5657'
        }
        //Photo.findById = jest.fn().mockReturnValue({ _id: 5657, privacy: 'private', ownerId: 56757 })
        res.status.send = jest.fn();
        photoController.addComment(req, res);
        expect(res.statusCode).toBe(400);

    });
    it('should check if comment is valid and return error code 400', async ()=> {

        // set comment data in request body
        req.body.comment= 768;
        //set parameters sent in path
        res.status.send = jest.fn();
        req.params.photoId= '609dda0c9a52002aa498bf01';
        await photoController.addComment(req, res);
        
        expect(res.statusCode).toBe(400);
    });
    it('should return status 201 when inputs are valid',  async ()=> {
        // set comment data in request body
        req.body.comment= "great";
        //set parameters sent in path
        res.status.send = jest.fn();
        req.params.photoId= '609dda0c9a52002aa498bf01';
        await photoController.getComments(req, res);
        expect(res.statusCode).toBe(201);
    });
});

describe('get comments',  () => {
    beforeAll(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
    
            });
        await mongoose.connection.dropDatabase();
        req = { headers: {}, params: {}, body: {} };
        res = {
          locals: {userid: '608834536de13632903701b7'},
          response: null,
          statusCode: 0,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.response = data;
          },
          send: ()=>{}
        };
        user = new User(user1);
        await user.save();
        photo = new Photo(photo1);
        await photo.save();
      });
    it('should return error 400 if photoId sent in params is invalid', async() => {
        //set parameters sent in path
        req.params = {
            photoId: '5657'
        }
        
        await photoController.getComments(req, res);
        expect(res.statusCode).toBe(400);

    });
    it('should check if photo is found and return status code 404', async ()=> {

        //set parameters sent in path
        req.params.photoId= '608f4985780a9381560f77e1';
        await photoController.getComments(req, res);
        //expect(photoModel.validateComment).toHaveBeenCalled();
        expect(res.statusCode).toBe(404);
    });
    it('should return status 201 when inputs are valid',  async()=> {

        //set parameters sent in path
        req.params.photoId= '609dda0c9a52002aa498bf01';
        await photoController.getComments(req, res);
        expect(res.statusCode).toBe(201);
    });
});

describe('delete comments',  () => {
    beforeAll(async () => {
        const url = "mongodb://127.0.0.1:27017/jestphoto1";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
    
            });
        await mongoose.connection.dropDatabase();
        user = new User(user1);
        await user.save();
        photo = new Photo(photo1);
        await photo.save();
      });
    beforeEach(async () => {
        req = { headers: {}, params: {}, body: {} };
        res = {
          locals: {userid: '608834536de13632903701b7'},
          response: null,
          statusCode: 0,
          status: function (code) {
            this.statusCode = code;
            return this;
          },
          json: function (data) {
            this.response = data;
          },
          send: ()=>{}
        };
      });

    it('should return error 400 if photoId sent in params is invalid', async () => {
        //set parameters sent in path
        req.params = {
            photoId: '5657'
        }

        await photoController.deleteComment(req, res);
        expect(res.statusCode).toBe(400);

    });
    it('should check if photo is found and return status code 404', async ()=> {
     
        req.params.photoId= '608f4985780a9381560f77e1';
        await photoController.deleteComment(req, res);
        expect(res.statusCode).toBe(404);
    });
    it('should return status 404 when when comment is not found', async ()=> {
    
        req.params = {
            photoId: '609dda0c9a52002aa498bf05',
            commentId:'60b67a62c1cbaa6688788a8c'
        };   
        await photoController.deleteComment(req, res);
        expect(res.statusCode).toBe(404);
    });
});
