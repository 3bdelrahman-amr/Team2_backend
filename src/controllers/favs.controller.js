const { Photo } = require('../models/photo.model');
const { UserModel: User } = require('../models/user.model');
/**
 * A function that lets the user add a photo to their favorites
 *
 * @function
 * @author Mostafa Omar
 * @summary Add photo to favorites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 404 Photo not found
 * @throws 422 Missing photo parameter
 * @throws 500 Photo is already in favorites
 */
exports.addFav = async function (req, res) {
  const photoId = req.body.photo_id;
  const userId = res.locals.userid;
  const photo = await Photo.findById(photoId).exec();
  if (!photoId) {
    res.status(422).json({ message: 'Missing photo parameter' });
  } else if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
  } else {
    const number = await Photo.find({
      _id: photoId,
      Fav: {
        $elemMatch: { $eq: userId },
      },
    }).exec();
    if (number.length > 0) {
      return res.status(500).json({
        message: 'Photo is already in favorites',
      });
    }
    await Photo.findByIdAndUpdate(photoId, {
      $addToSet: { Fav: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $addToSet: { Fav: photoId },
    });
    res.status(200).json({
      message: 'Photo added to favourites list successfully',
    });
  }
};
/**
 * A function that lets the user remove a photo from their favorites
 *
 * @function
 * @author Mostafa Omar
 * @summary Remove photo from favorites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @throws 404 Photo not found
 * @throws 422 Missing photo parameter
 * @throws 500 Photo not in favourites list
 */
exports.removeFav = async function (req, res) {
  const photoId = req.params.photoid;
  const photo = await Photo.findById(photoId).exec();
  const userId = res.locals.userid;
  if (!photoId) {
    res.status(422).json({ message: 'Missing photo parameter' });
  } else if (!photo) {
    res.status(404).json({ message: 'Photo not found' });
  } else {
    const number = await Photo.find({
      _id: photoId,
      Fav: {
        $elemMatch: { $eq: userId },
      },
    }).exec();
    if (number.length === 0) {
      return res.status(500).json({
        message: 'Photo not in favourites list',
      });
    }
    await Photo.findByIdAndUpdate(photoId, {
      $pull: { Fav: userId },
    });
    await User.findByIdAndUpdate(userId, {
      $pull: { Fav: photoId },
    });
    res.status(200).json({
      message: 'Photo deleted from favourites list and removed from likes',
    });
  }
};
