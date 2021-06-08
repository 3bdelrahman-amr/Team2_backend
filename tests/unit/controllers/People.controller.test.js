const poepleController = require('../../../src/controllers/people.controller');
const { UserModel: User } = require('../../../src/models/user.model');

const mongoose = require('mongoose');


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

beforeAll(async () => {
        const url = "mongodb://127.0.0.1:27017/jestpeople";
        await mongoose.connect(url,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true
    
            });
        await mongoose.connection.dropDatabase();
        user = new User(user1);
        await user.save();
        user_2 = new User(user2);
        await user_2.save();
      });
beforeEach(async()=>{
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
})
afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
})

describe('get faves',  () => {
    it('should return error 404 if user with username is not found', async () => {
        //set parameters sent in path
        req.params.username="adel";
        await poepleController.getfaves(req, res);
        expect(res.statusCode).toBe(404);

    });
    it('should succed if user with username is found', async ()=> {
        //set parameters sent in path
        req.params.username='test';
        await poepleController.getfaves(req, res);
        expect(res.statusCode).toBe(201);
    });
});

describe('search users',  () => {
    it('should succeed if a user matches the input', async ()=> {
        req.params.username="test"

        await poepleController.getfaves(req, res);
        expect(res.statusCode).toBe(201);
    });
});

describe('get following',  () => {
    it('should return status code 400 userId is incorrect', async ()=> {
        req.params.userId='364237846';
        await poepleController.getFollowing(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should return status code 400 userId is incorrect', async ()=> {
        req.params.userId='364237846';

        await poepleController.getFollowing(req, res);
        expect(res.statusCode).toBe(400);
    });
    it('should succeed userId is correct', async ()=> {
        req.params.userId='608834536de13632903701b7';

        await poepleController.getFollowing(req, res);
        expect(res.statusCode).toBe(201);
    });
});