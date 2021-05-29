const request = require('supertest');
const app = require('../../src/app');
const { UserModel: User } = require('../../src/models/user.model');
const { Photo } = require('../../src/models/photo.model');
const { Album } = require("../..//src/models/album.model");
const baseUrl = '/api/v1/';
const mongoose = require('mongoose');
const config = require('config');
const { response } = require('../../src/app');

const user = {
    Email: 'Moustafa.Achraf@hotmail.com',
    UserName: 'test',
    Fname: 'test',
    Lname: 'test',
    username: 'test',
    about: 'test',
    date_joined: Date.now(),
    Age: 25,
    Password: 'mostafa123',
    Fav: [],
};

const album1 = {
    title:'album',
    description:'Doing laundry',
    photos:["609dda0c9a52002aa498bf01"],
    coverPhoto: "609dda0c9a52002aa498bf01",
    ownerId: "60b1902b5376e5011c26eb82"
}

const album2 = {
    title:'album',
    description:'washing',
    photos:["609dda0c9a52002aa498bf01"],
    coverPhoto: "609dda0c9a52002aa498bf01",
    ownerId: "60b1902b5376e5011c26eb82"

}

const photo = {
    title: 'test',
    photoUrl: 'test',
    description: 'test',
    Fav: [],
    privacy: 'private',
    ownerId: '60b1902b5376e5011c26eb82'
}
describe('Should create a new album', function () {
    beforeEach(async () => {
        //Connecting to testing database
        await mongoose.connect(config.get('db'), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });

        await User.deleteMany();
        await Album.deleteMany();
        await Photo.deleteMany();
        //creating a user to be the one that is logged in
        await new User(user).save();

        //adding photos to the user that will create the album
        await new Photo(photo).save();

    });

    test("Should create album successfully", async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjE5MDJiNTM3NmU1MDExYzI2ZWI4MiIsImlhdCI6MTYyMjI5MDAwMywiZXhwIjoxNjIyMzc2NDAzfQ.Dslk9nUs3xMTbvSDNCDCk2PcXa9uk0U1BnP-c-sDI4A"; // the token that shall be used in authentication
        const image  = await Photo.find(photo);
        const photo_id = image[0]._id
        console.log("The image")
        console.log(image);
        console.log("The photo id")
        console.log(photo_id)
        const body = {
            photos: photo_id,
            title: 'album',
            description: 'Nature'
        }
        console.log(body)
        const response = await request(app)
            .post(baseUrl + '/album')
            .set({ token: token })
            .send(body)
            .expect(201); // assertion about the status code

        
        //Assert that DB was changed correctly
        const album = await Album.findById(response.body._id);
        expect(album).not.toBeNull();

        //Assertions about the response
        expect(response.body).toMatchObject({
            photos: [
                "609dda0c9a52002aa498bf01"
            ],
            title: "album",
            description: "Nature",
            ownerId: "609dd9ac9a52002aa498befe"
        })
    })

    test("Should return status code 400 for passing unsufficient paramters", async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjE5MDJiNTM3NmU1MDExYzI2ZWI4MiIsImlhdCI6MTYyMjI5MDAwMywiZXhwIjoxNjIyMzc2NDAzfQ.Dslk9nUs3xMTbvSDNCDCk2PcXa9uk0U1BnP-c-sDI4A"; // the token that shall be used in authentication
        const body = {
            title: 'album',
            description: 'Nature'
        }; // there is not photo array passed in body ... which is required
        const response = await request(app)
            .post(baseUrl + '/album')
            .set({ token: token })
            .send(body)
            .expect(400); // assertion about the status code
    })

    test("Should return status code 401 for not passing token", async () => {
        const body = {
            title: 'album',
            description: 'Nature'
        }
        const response = await request(app)
            .post(baseUrl + '/album')
            .send(body)
            .expect(403); // assertion about the status code
    })

    test("Should return status code 404 for not finding the photo in the photo array", async () =>{
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjE5MDJiNTM3NmU1MDExYzI2ZWI4MiIsImlhdCI6MTYyMjI5MDAwMywiZXhwIjoxNjIyMzc2NDAzfQ.Dslk9nUs3xMTbvSDNCDCk2PcXa9uk0U1BnP-c-sDI4A"; // the token that shall be used in authentication
        const body = {
            photos: ["609dda0c9a52002aa498bf00"],
            title: 'album',
            description: 'Nature'
        }
        const response = await request(app)
            .post(baseUrl + '/album')
            .set({ token: token })
            .send(body)
            .expect(404); // assertion about the status code

    })

})

describe("Should get all the user album", function() {
    beforeEach(async () => {
        //Connecting to testing database
        await mongoose.connect(config.get('db'), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        });
        await User.deleteMany();
        await Album.deleteMany();
        await Photo.deleteMany();
        //creating a user to be the one that is logged in
        await new User(user).save();

        //adding photos to the user that will create the album
        await new Photo(photo).save();

        await new Album(album1).save();
        await new Album(album2).save();

        test("Should get the albums album successfully", async ()=>{
            const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYjE5MDJiNTM3NmU1MDExYzI2ZWI4MiIsImlhdCI6MTYyMjI5MDAwMywiZXhwIjoxNjIyMzc2NDAzfQ.Dslk9nUs3xMTbvSDNCDCk2PcXa9uk0U1BnP-c-sDI4A"; // the token that shall be used in authentication
                const response = await request(app)
                .get(baseUrl+ "/album")
                .set({token:token})
                .send()
                .expect(200) // assertion about status code


        })
    });
})



