const httpmocks = require('node-mocks-http');
const mongoose = require('mongoose');
const photoController = require('../../../src/controllers/photo.controller');
const photoModel = require('../../../src/models/photo.model')
const User = require('../../../src/models/user.model');
//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
beforeAll(async () => {
    const url = "mongodb://127.0.0.1:27017/jestphoto";
    await mongoose.connect(url,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true

        });

});
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();

})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


describe('add tag',()=>{
    it('should return 400 if the user does not enter any photo id',async()=>{
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        res.statusCode = 0;
        photoController.addTag(req,res);
        expect(res._getStatusCode()).toBe(400);
    });
    it('should search for photos with the gevin ids',async()=>{
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        photoModel.Photo.findById = jest.fn();
        req.body = {
            photos:['608f4985490a9381560f77e1']
        }; 
        photoController.addTag(req,res);
        expect(photoModel.Photo.findById).toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(200);
    });
});

describe('remove tag',()=>{
    it('should return 200 if the id is passed',async()=>{
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        req.params.id = '608f4985490a9381560f77e1';
        photoModel.Photo.findById = jest.fn();
        photoController.removeTag(req,res);
        expect(photoModel.Photo.findById).toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(200);
    });
});

describe('get photo by title',()=>{
    it('should return array of photos ',async()=>{
        const req = httpmocks.createRequest();
        const res = httpmocks.createResponse();
        req.params = {
            title : 'prfile'
        };
        photoModel.Photo.find = jest.fn();
        User.UserModel.findById = jest.fn();
        photoController.GetPhototitle(req,res);
        expect(res._getStatusCode()).toBe(200);
    });
});

describe('get photo by id',()=>{
    it('should failed if the passed id is not a valid id',async()=>{
        let req = httpmocks.createRequest();
        let res = httpmocks.createResponse();
        req.params = {
            photo_id:'1234'
        }
        photoController.GetPhoto(req,res);
        expect(res._getStatusCode()).toBe(400);
    });
    it('should return the photo with status 200 if the passed id is a valid id',async()=>{
        let req = httpmocks.createRequest();
        let res = httpmocks.createResponse();
        req.params = {
            photo_id:'608f4985490a9381560f77e1'
        }
        photoModel.Photo.findById = jest.fn();
        photoController.GetPhoto(req,res);
        expect(photoModel.Photo.findById).toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(200);
    });
});