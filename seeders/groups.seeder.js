const { Group } = require('../src/models/groups.model');
const { Seeder } = require('mongoose-data-seed');

const data = [
  {
    _id: '60b51093f85b283d3cea6f75',
    Photos: ['608834536de13632903701b7'],
    description: null,
    privacy: 'public',
    visibility: 'public',
    name: 'Group 1',
    Members: [
      {
        role: 'admin',
        ref: '60b4692859dd7f45e0c19119',
      },
    ],
  },
];

class GroupSeeder extends Seeder {
  async shouldRun() {
    const count = await Group.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return Group.create(data);
  }
}

module.exports = GroupSeeder;
