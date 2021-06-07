const userModel = require('../src/models/user.model');
const { Seeder } = require('mongoose-data-seed');

const data = [
  {
    _id: "60b4692859dd7f45e0c19119",
    Fname: "Admin",
    Lname: "AboAdmin",
    Email: "Admin@gmail.com",
    UserName: "Admin123",
    Password: '$2y$10$fZwYxct70W59lpO6rZ8I3.rWmNY41Lso.r9SERdk5WYvVJkV862OG' ,
    Age: 102,
    isActive:true,
  },
  {
    _id: "60b4692859dd7f45e0c19118",
    Fname: "default",
    Lname: "default",
    Email: "default@gmail.com",
    UserName: "default123",
    Password: '$2y$10$fZwYxct70W59lpO6rZ8I3.rWmNY41Lso.r9SERdk5WYvVJkV862OG',
    Age: 102,
    isActive: true,
    Group: ['60b51093f85b283d3cea6f75'],
  },
];

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
