const userModel=require('../src/models/user.model');
const {Seeder}=require('mongoose-data-seed');


const data=[
    {
        
        Fname:'default',
        Lname :'default',
        Email:'default@gmail.com',
        UserName:'default123',
        Password:'1234',
        Age:102,

    },
]

class UsersSeeder extends Seeder {
    async shouldRun() {
      const count = await userModel.UserModel.countDocuments().exec();
  
      return count === 0;
    }
  
    async run() {
      return userModel.UserModel.create(data);
    }
  }

module.exports = UsersSeeder;