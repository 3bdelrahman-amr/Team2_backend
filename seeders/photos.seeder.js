const PhotoModel = require("../src/models/photo.model");
const { Seeder } = require("mongoose-data-seed");
const mongoose = require("mongoose");

var id = mongoose.Types.ObjectId("608834536de13632903701b7");

const data = [
  {
    _id: id,
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl: "https://upload.wikimedia.org/wikipedia/ar/d/d4/Mickey_Mouse.png",
  },
  {
    Fav: ["60b4692859dd7f45e0c19119"],
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl:
      "https://iresizer.devops.arabiaweather.com/resize?url=https://adminassets.devops.arabiaweather.com/sites/default/files/field/image/moon_2.jpg&size=850x478&force_jpg=1",
    comments: [
      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "ew3a ba",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "yarab n5las",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "we are strong",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "time bomb",
        user: "60b4692859dd7f45e0c19119",
      },

      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
    ],
  },
  {
    Fav: ["60b4692859dd7f45e0c19119"],
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl:
      "https://cdn.mos.cms.futurecdn.net/PQkLFCAiLV4bknjnhqNDyW-1024-80.jpg.webp",
    comments: [
      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "ew3a ba",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "yarab n5las",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "we are strong",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "time bomb",
        user: "60b4692859dd7f45e0c19119",
      },

      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
    ],
  },
  {
    Fav: ["60b4692859dd7f45e0c19119"],
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl: "https://www.jeasonline.org/frontend/images/NewImage1.jpeg",
    comments: [
      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "ew3a ba",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "yarab n5las",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "we are strong",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "time bomb",
        user: "60b4692859dd7f45e0c19119",
      },

      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
    ],
  },
  {
    Fav: ["60b4692859dd7f45e0c19119"],
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl:
      "https://play-lh.googleusercontent.com/-B4OMUAx3roQaksfWFZlyk8kHNU8raITHAm5_4BBbiQb7dyrlxTkYLWs3W6eb-CkjDQ=s180-rw",
    comments: [
      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "ew3a ba",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "yarab n5las",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "we are strong",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "time bomb",
        user: "60b4692859dd7f45e0c19119",
      },

      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
    ],
  },

  {
    Fav: ["60b4692859dd7f45e0c19119"],
    ownerId: "60b4692859dd7f45e0c19119",
    photoUrl:
      "https://www.cairowaterweek.eg/wp-content/uploads/2018/05/Hesham-Bekhit.jpg",
    comments: [
      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "ew3a ba",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "yarab n5las",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "we are strong",
        user: "60b4692859dd7f45e0c19119",
      },
      {
        comment: "time bomb",
        user: "60b4692859dd7f45e0c19119",
      },

      {
        comment: "ya hala ya hala",
        user: "60b4692859dd7f45e0c19119",
      },
    ],
  },
];

class PhotosSeeder extends Seeder {
  async shouldRun() {
    const count = await PhotoModel.Photo.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return PhotoModel.Photo.create(data);
  }
}

module.exports = PhotosSeeder;
