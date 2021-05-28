const express = require('express');
const router = express.Router();
const {authentication} = require('../../middlewares/auth');
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
 *       required: false
 *       description: Album description
 *       type: string
 *       schema:
 *     - name: photos
 *       description: The ids of photos that the album is created with
 *       in: body
 *       required: true
 *       type: array
 *       items:
 *          type: _id
 *       schema:
 *     - name: coverPhoto
 *       in: body
 *       required: false
 *       description: Album cover photo
 *       type: _id
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
 *                       "error": "Internal Server error",
 *            }
 */


router.post('/', authentication, albumController.createAlbum)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /album/{album_id}:
 *   post:
 *     tags: [Album]
 *     description: Add photos to album.
 *     
 *     parameters:
 *     - name: Album_id
 *       in: url
 *       description: the album id that the photos will be added to
 *       required: true
 *       schema:
 *     - name: photos'_id
 *       in: body
 *       required: true
 *       type: integer
 *       description: Array of photos ids to add to the album
 *       schema:
 *         type: object
 *         properties:
 *            photos:  
 *              type: array
 *              items:
 *                  type: integer
 *          
 *     responses:
 *       201:
 *         description: returns array of photos ids of the album
 *         schema:
 *          type: object
 *          properties:
 *            photos:  
 *              type: array
 *              items:
 *                  type: integer
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
 *       404:
 *         description: album not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Not found",
 *            }
 *       500:
 *         description: Internal Server error
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Internal Server error",
 *            }
 *       $ref: "#/definitions/ApiResponse"
 */


 router.post('/:id', authentication, albumController.addPhotoToAlbum)

 /////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /album/{album_id}:
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
 *       - name: coverPhoto
 *         in: body
 *         type: _id 
 *         required: false
 *         description: album cover photo
 *         schema:
 *           $ref: '#/definitions/EditAlbum'
 *           photo_id:
 *               type: integer
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            $ref: "#/definitions/CreateAlbumResponse"
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
 *       500:
 *         description: Internal Server error
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Internal Server error",
 *            }
 *                
 *
 */

router.put('/:id', authentication, albumController.updateAlbum);
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
 *     parameters:
 *       - name: album_id
 *         in: url
 *         required: true
 *         description: Album id
 *         schema:
 *           type: integer
 *           format: int32
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
 *       400:
 *         description: invalid ID
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": Invalid album Id",
 *            }
 * 
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Unauthorized request",
 *            }
 *       500:
 *         description: Internal Server error
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Internal Server error",
 *            }
 *                
 */

router.delete('/:id', authentication, albumController.deleteAlbum);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /album/photos/{album_id}:
 *   delete:
 *     tags: [Album]
 *     description: Remove photos from album.
 *     
 *     parameters:
 *     - name: Album_id
 *       in: url
 *       description: the album id that the photos will be added to
 *       required: true
 *       schema:
 *     - name: photos'_id
 *       in: body
 *       required: true
 *       description: Array of photos ids to add to the album
 *       schema:
 *         type: object
 *         properties:
 *            photos:  
 *              type: array
 *              items:
 *                  type: integer
 *          
 *     responses:
 *       201:
 *         description: returns array of photos ids of the album
 *         schema:
 *          type: object
 *          properties:
 *            photos:  
 *              type: array
 *              items:
 *                  type: integer
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
 *       404:
 *         description: album not found
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Not found",
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


 router.delete('/photos/:id', authentication, albumController.removePhotoFromAlbum)

 /////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
 /////////////////////////////////////////////////////////////////////
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
 * 
 *       400:
 *         description: invalid ID
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": Invalid album Id,
 *            }
 * 
 *       500:
 *         description: No value passed
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Internal Server error",
 *            }
 */

router.get('/:id', authentication, albumController.getAlbumbyId)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * /album:
 *   get:
 *     tags: [Album]
 *     description: Return all the user albums
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            type: array
 *            items:
 *              $ref: "#/definitions/getAlbumByID"
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "User is not authorized to create album",
 *            }
 *       500:
 *         description: No value passed
 *         examples:
 *          application/json:
 *
 *            {
 *                       "error": "Internal Server error",
 *            }
 */

router.get('/', authentication, albumController.getUserAlbums);


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

router.get('/user/:username', authentication, albumController.getAlbumbyUsername)

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
 *      coverPhoto:
 *        type: integer
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
 *      coverPhoto:
 *        type: integer
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
 *      coverPhoto:
 *           type: integer
 *  EditAlbum:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      coverPhoto:
 *        type: integer
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
 *           $ref: '#/responses/photo'
 */
module.exports = router
