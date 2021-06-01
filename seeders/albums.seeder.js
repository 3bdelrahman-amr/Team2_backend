const { Album } = require('../src/models/album.model');
const { Seeder } = require('mongoose-data-seed');

const data = [
    {
        title: "Album1",
        description: "album number 1",
        ownerId: "",
        photos: [""],
        coverPhoto: ""
    },
    {
        _id: '60b51093f85b283d3cea6f70',
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
        ]
    }
];

class AlbumSeeder extends Seeder {
    async shouldRun() {
        const count = await Album.countDocuments().exec();

        return count === 0;
    }

    async run() {
        return Album.create(data);
    }
}

module.exports = AlbumSeeder;