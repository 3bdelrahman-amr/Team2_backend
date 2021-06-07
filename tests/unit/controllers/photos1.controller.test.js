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
    ownerId: '608834536de13632903701b7'
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

describe('explore', async () => {
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

describe('add tag people', async () => {
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

describe('remove tag people', async () => {
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