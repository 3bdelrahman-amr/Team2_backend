const express = require('express')
const router = express.Router()
const { authentication } = require('../../middlewares/auth');
const peopleController = require('../../controllers/people.controller')
const { UserModel, validateId } = require('../../models/user.model');

/**
 * @swagger
 * /people/groups/{userid}:
 *   get:
 *     tags: [People]
 *     description: Return list of groups a user is in.
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            [
 *              {
 *                           "title": "Group 1",
 *                           "id": 1
 *              },
 *              {
 *                           "title": "Group 2",
 *                           "id": 2
 *              },
 *            ]
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "User not found",
 *            }
 *     parameters:
 *       - name: userid
 *         in: path
 *         required: true
 *         description: User id to search on it
 *
 */

router.get('/getgroups/:userid', (req, res) => {
    console.log(req.params.id)
    res.send({
        id: 'route',
    })
})

/**
 * @swagger
 * /people/photos/{user_id}:
 *   get:
 *     tags: [People]
 *     description: Return list of public photos.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/responses/photoInfo'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "User not found",
 *            }
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: User id to search on it
 *
 */

router.get('/photos/:userId', authentication,peopleController.getPhotos);
/**
 * @swagger
 * /people/{username|email|id}:
 *   get:
 *     tags: [People]
 *     description: Get info about a user using their name/id/email.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/responses/UserByName'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "User not found",
 *            }
 *     parameters:
 *       - name: identifier
 *         in: path
 *         required: true
 *         description: user identifier (username/email/id) to search on it
 *
 *
 */

router.get('/findByUsername/:username', authentication,async (req, res) => {
    console.log(req.body.name)
})
/**
 * @swagger
 * /people/{username|email|id}:
 *   get:
 *     tags: [People]
 *     description: Get info about a user using their name/id/email.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           $ref: '#/responses/UserByName'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "User not found",
 *            }
 *     parameters:
 *       - name: identifier
 *         in: path
 *         required: true
 *         description: user identifier (username/email/id) to search on it
 *
 *
 */


router.get('/:title',authentication, peopleController.GetPeopleByUserName_ID_Email);

router.get('/people', (req, res) => {
    console.log(req.body.name)
})

/**
 * @swagger
 * /people/search/{username|email|fName|Lname}:
 *   get:
 *     tags: [People]
 *     description: search for user using name,username or email.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref:  '#/responses/peopleinfo'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "User not found",
 *            }
 *     parameters:
 *       - name: identifier
 *         in: path
 *         required: true
 *         description: user identifier (username/email/name) to search on it
 *
 *
 */

 router.get('/search/:string',authentication, peopleController.searchUsers)


/**
 * @swagger
 * /people/following/{user_id}:
 *   get:
 *     tags: [People]
 *     description: list of the  following users.
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref:  '#/responses/Followinginfo'
 *
 *       404:
 *         description: Not found
 *         examples:
 *           application/json:
 *
 *             {
 *                       "message": "User not found",
 *             }
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: user's id will be used to get its following list
 *
 *
 */

router.get('/following/:userId', authentication, peopleController.getFollowing)



/**
 * @swagger
 * /people/fav/{username}:
 *   get:
 *     tags: [People]
 *     description: people fav list.
 *     parameters:
 *       - name: username
 *         in: path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/responses/favesinfo'
 *
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "list not found",
 *            }
 *       422:
 *         description: Missing photo parameter
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "Missing  parameter",
 *            }
 *
 *
 *
 */

router.get('/fav/:username', authentication,peopleController.getfaves );

/**
 *@swagger
 *responses:
 *  peopleinfo:
 *    type: object
 *    properties:
 *     Fname:
 *       type: string
 *     Lname:
 *       type: string
 *     UserName:
 *       type: string
 *     _id:
 *       type: integer
 *       format: int32
 *     Date_joined:
 *       type: string
 *       format: date
 *     numberOfPublicPhotos:
 *       type: integer
 *       format: int32
 *     numberOfFollowers:
 *       type: integer
 *       format: int32
 *     avatarUrl:
 *       type: string
 *     isFollowed:
 *       type: boolean
 *
 *
 *  photoInfo:
 *    type: object
 *    properties:
 *     userName:
 *       type: string
 *     tags:
 *       type: string
 *     title:
 *       type: string
 *     description:
 *       type: string
 *     photoUrl:
 *       type: string
 *     peopleTags:
 *       type: string
 *     _id:
 *       type: integer
 *       format: int32
 *     ownerId:
 *       type: integer
 *       format: int32
 *     privacy:
 *       type: string
 *     createdAt:
 *       type: string
 *       format: date
 *     updatedAt:
 *       type: string
 *       format: date
 *     numberOfFavs:
 *       type: integer
 *       format: int32
 *     numberOfComments:
 *       type: integer
 *       format: int32
 * 
 *  Followinginfo:
 *    type: object
 *    properties:
 *     Fname:
 *       type: string
 *     Lname:
 *       type: string
 *     UserName:
 *       type: string
 *     id:
 *       type: integer
 *       format: int32
 *     numberOfPublicPhotos:
 *       type: integer
 *       format: int32
 *
 *  favesinfo:
 *    type: object
 *    properties:
 *     userName:
 *       type: string
 *     _id:
 *       type: integer
 *       format: int32
 *     title:
 *       type: string
 *     photoUrl:
 *       type: string
 *     numberOfComments:
 *       type: integer
 *       format: int32
 *
 *
 */
module.exports = router
