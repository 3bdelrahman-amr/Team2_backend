const { Album } = require('../src/models/album.model');
const { Seeder } = require('mongoose-data-seed');
const mongoose = require('mongoose');

const data = [
    {
        _id: "608834536de13632903701b0",
        title: "Album1",
        description: "album number 1",
        ownerId: "60b4692859dd7f45e0c19119",
        photos: ["608834536de13632903701b7"],
        coverPhoto: "608834536de13632903701b7"
    },
    {
        _id: "608834536de13632903701b1",
        title: "Album2",
        description: "album number 2",
        ownerId: "60b4692859dd7f45e0c19119",
        photos: ["608834536de13632903701b7"],
        coverPhoto: "608834536de13632903701b7"
    },
    {
        _id: "608834536de13632903701b2",
        title: "Album3",
        description: "album number 3",
        ownerId: "60b4692859dd7f45e0c19119",
        photos: ["608834536de13632903701b7"],
        coverPhoto: "608834536de13632903701b7"
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