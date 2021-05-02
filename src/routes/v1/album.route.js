const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');
const albumController = require('../../controllers/album.controller');

/**
 * @swagger
 * /album:
 *   post:
 *     tags: [Album]
 *     description: Create new album.
 *     
 *     parameters:
 *     - name: title
 *       in: body
 *       required: true
 *       description: Album title
 *       schema:
 *     - name: description
 *       in: body
 *       required: true
 *       description: Album description
 *       type: string
 *       schema:
 *     - name: photos
 *       description: The photos that the album is created with
 *       in: body
 *       required: false
 *       type: array
 *       items:
 *          type: _id
 *       
 *       schema:
 *          $ref: "#/definitions/CreateAlbumRequest"
 *     responses:
 *       201:
 *         description: Created successfully
 *         schema:
 *            $ref: "#/definitions/CreateAlbumResponse"
 *          
 *          
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "User is not authorized to create album",
 *            }
 *       400:
 *         description: Invalid parameters
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Bad request",
 *            }
 *       500:
 *         description: Internal Server error
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "An error has occured",
 *            }
 *       $ref: "#/definitions/ApiResponse"
 */


router.post('/album',auth, albumController.createAlbum)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /album/{album:id}:
 *   put:
 *     tags: [Album]
 *     description: Update album.
 *     parameters:
 *       - name: album_id
 *         in: url
 *         required: true
 *         description: album id
 *         schema:
 *       - name: title
 *         in: body
 *         type: string 
 *         required: false
 *         description: album new updated title
 *         schema:
 *       - name: description
 *         in: body
 *         type: string 
 *         required: false
 *         description: album description
 *         schema:
 *           $ref: '#/definitions/EditAlbum'
 *           photo_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "Album updated successfully"
 *            }
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Album not found",
 *            }
 *       400:
 *         description: Bad request
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Invalid updates",
 *            }
 *
 */

 router.put('/album/:id',auth, albumController.updateAlbum);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /album/{album_id}:
 *   delete:
 *     tags: [Album]
 *     description: delete album by id.
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                       "message": "Album successfully deleted"
 *            }
 *       404:
 *         description: Album not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Album not found",
 *            }
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Unauthorized request",
 *            }
 *     parameters:
 *       - name: album_id
 *         in: url
 *         required: true
 *         description: Album id
 *         schema:
 *           type: integer
 *           format: int32
 */

router.delete('/album/:id',auth,albumController.deleteAlbum);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /album/{album_id}:
 *   get:
 *     tags: [Album]
 *     description: Return album by ID.
 *     parameters:
 *       - name: album_id
 *         in: url
 *         required: true
 *         description: album id
 *         schema:
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *             $ref: "#/definitions/getAlbumByID"
 *
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Album not found",
 *            }
 *       500:
 *         description: No value passed
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Album id not sent",
 *            }
 */

router.get('/album/:id',auth,albumController.getAlbumbyId)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /album:
 *   get:
 *     tags: [Album]
 *     description: Return all the user albums
 *     parameters:
 *       - name: token
 *         in: header
 *         required: true
 *         description: the user token
 *         schema:
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            type: array
 *            items:
 *              $ref: "#/definitions/getAlbumByID"

 *       500:
 *         description: No value passed
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Album id not sent",
 *            }
 */

 router.get('/album',auth,albumController.getUserAlbums);


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /album/user/{username}:
 *   get:
 *     tags: [Album]
 *     description: Return albums of the user with the given username
 *     parameters:
 *       - name: username
 *         in: url
 *         required: true
 *         description: username
 *         schema:
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            type: array
 *            items:
 *              $ref: "#/definitions/getAlbumByID"
 * 
 *       404:
 *         description: User not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "User not found",
 *            }
 *       500:
 *         description: No value passed
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Username is not sent",
 *            }
 */

 router.get('/album/user/:username',auth,albumController.getAlbumbyUsername)

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

/**
 * @swagger
 *
 *definitions:
 *  Album:
 *    type: object
 *    properties:
 *      album_id:
 *        type: integer
 *      title:
 *        type: string
 *      description:
 *        type: string
 *  CreateAlbumRequest:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      photos:
 *        type: array
 *        items:
 *          type: integer
 *  CreateAlbumResponse:
 *    type: object
 *    properties:
 *      _id:
 *        type: integer
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      createdAt:
 *        type: string
 *      photos:
 *          type: array
 *          items:
 *             type: integer
 *  getAlbumByID:
 *    type: object
 *    properties:
 *      _id:
 *        type: integer
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      createdAt:
 *        type: string
 *      updatedAt:
 *        type: string
 *      photos:
 *          type: array
 *          items:
 *             type: integer
 *  EditAlbum:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 */
/**
 * @swagger
 * responses:
 *   Album:
 *     type: object
 *     properties:
 *       Albums:
 *         type: array
 *         items:
 *           $ref: '#/responses/image'
 */
module.exports = router
