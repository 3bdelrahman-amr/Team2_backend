const httpmocks=require('node-mocks-http');
const mongoose=require('mongoose');
const userModel=require('../../../src/controllers/user.controller');
const Model = require('../../../src/models/user.model');
const Photo = require('../../../src/models/photo.model');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
beforeAll(async()=>{
    const url="mongodb://127.0.0.1:27017/jestuser";
await mongoose.connect(url,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
        
      });

    });
//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

    afterAll(async()=>{
await mongoose.connection.db.dropDatabase();
await mongoose.connection.close();

    })

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    test('testing user register',async()=>{
    // create fake response and request
     const req=httpmocks.createRequest();
     const res=httpmocks.createResponse();
     // set user data in request body
     req.body={
         Fname:'Ahmed',
         Lname:'Mohamed',
         Email:'Ahmed.mohamed10@gmail.com',
         Age:30,
         Password:'1234'

     }

     function my_next(){
         expect(res.locals).toHaveProperty('userid');
         expect(response.statusCode).toBE(200);
         return;

     }
     
    await userModel.register(req,res,my_next);



    });


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    test('testing user login',async()=>{
        // create fake response and request
         const req=httpmocks.createRequest();
         const res=httpmocks.createResponse();
         // set user data in request body
         req.body={
             //Fname:'Ahmed',
             //Lname:'Mohamed',
             Email:'Ahmed.mohamed10@gmail.com',
             //Age:30,
             Password:'1234'
    
         }
    
         function my_nex(){
             expect(res.locals).toHaveProperty('userid');
             return;
    
         }
        await userModel.login(req,res,my_nex);
    
    
    
        });

        
describe('get user favs',()=>{
    it('should return photos',()=>{
        let req = httpmocks.createRequest();
        let res = httpmocks.createResponse();
        res.locals.userid = '608834536de13632903701b7';
        Model.UserModel.findById = jest.fn();
        Photo.Photo.findById = jest.fn();
        userModel.GetFav(req,res);
        res.send = jest.fn();
        
        expect(Model.UserModel.findById).toHaveBeenCalled();
        expect(res._getStatusCode()).toBe(200);
    });
});
