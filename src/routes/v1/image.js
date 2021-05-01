const express = require('express')
const router = express.Router()
//schemas
/**
 * @swagger
 * definitions:
 *   Image:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       description:
 *         type: string
 *         required: false
 *       file:
 *         type: string
 *         format: base64
 *
 *
 */
/**
 * @swagger
 *  /image:
 *   post:
 *     description: Add Image
 *     tags: [Image]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Image's data
 *         schema:
 *           $ref: '#/definitions/Image'
 *     responses:
 *       201:
 *         description: Image created successfully
 *         examples:
 *          application/json:
 *
 *            {
 *                     "image_id": 0,
 *            }
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized request",
 *            }
 *       500:
 *         description: Bad file type
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Bad file type",
 *            }
 */

router.post('/uploadimage/image', (req, res) => {})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 *  /image/tag:
 *   post:
 *     description: Add tag to photo
 *     tags: [Image]
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: Image id to add tag to the corresponding image
 *         type: object
 *         properties:
 *           image_id:
 *             type: integer
 *             format: int64
 *             description: Tag to add to photo
 *           tag:
 *             required: true
 *             type: string
 *             description: Tag to add to photo
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "image_id": 0,
 *            }
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized request",
 *            }
 */

router.put('/tag', (req, res) => {})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 *  /image/{image_id}:
 *   delete:
 *     description: Delete a photo
 *     tags: [Image]
 *     parameters:
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: image id to add tag to the corresponding image
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image deleted successfully",
 *            }
 *       401:
 *         description: Unauthorized
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized request",
 *            }
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 */

router.delete('/delete/:image_id', (req, res) => {})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /image/comment:
 *   post:
 *     description: Add comment to photo
 *     tags: [Image]
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: Image id to add tag to the corresponding image
 *         type: object
 *         properties:
 *           image_id:
 *             type: integer
 *           comment:
 *             type: string
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Success",
 *            }
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized",
 *            }
 *
 */

router.put('/comment', (req, res) => {})
////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /image/explore:
 *   get:
 *     description: return list of images that are public and above certain number of likes.
 *     tags: [Image]
 *
 *
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *              $ref: '#/responses/image'
 *
 *       404:
 *         description: Not found
 *
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "images not found",
 *            }
 *
 *
 */

router.get('/image/explore', (req, res) => {})

/**
 * @swagger
 * /image/{photo_id}:
 *   put:
 *     description: change photo mode between { private public friends}
 *     tags: [Image]
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: Image id to add tag to the corresponding image
 *         type: object
 *         properties:
 *           title:
 *             type: string
 *           description:
 *             type: string
 *           privacy:
 *             type: string
 *             enum:
 *               -public
 *               -private
 *           visibility:
 *             type: string
 *             enum:
 *                -public
 *               -Invites
 *
 *     responses:
 *       200:
 *         description: Success
 *
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "updated successfully",
 *            }
 *
 *
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "not found",
 *            }
 *       401:
 *         description: bad request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "unauthorized request.",
 *            }
 *
 *
 */

router.put('/image/{image_id}', (req, res) => {})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * /image{image_id}/comment/{comment_id}:
 *   delete:
 *     description: delete comment from a photo
 *     tags: [Image]
 *     parameters:
 *       - name: comment_id
 *         in: path
 *         required: true
 *         description: comment_id to delete a comment from a photo
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: image_id to delete a comment from a it
 *
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Success",
 *            }
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized",
 *            }
 *
 */

router.put('/image/comment/{comment_id}', (req, res) => {})

/**
 * @swagger
 * /image/{image_id}/tag/{tag_id}:
 *   delete:
 *     description: delete a tag from a photo
 *     tags: [Image]
 *     parameters:
 *       - name: tag_id
 *         in: path
 *         required: true
 *         description: tag_id to delete a comment from a photo
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: image_id to delete a comment from a it
 *
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Success",
 *            }
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized",
 *            }
 *
 */

router.put('/image/:image_id/tag/{tag_id}', (req, res) => {})

/**
 * @swagger
 * /image/{image_id}:
 *   get:
 *     description: get a photo by id
 *     tags: [Image]
 *     parameters:
 *
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: image id
 *
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *            $ref: '#/definitions/Image'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized",
 *            }
 *
 */

router.get('/image/:image_id', (req, res) => {})

/**
 * @swagger
 * /image/{image_id}:
 *   get:
 *     description: get a photo by title
 *     tags: [Image]
 *     parameters:
 *
 *       - name: image_id
 *         in: path
 *         required: true
 *         description: image id
 *
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/responses/image'
 *       404:
 *         description: Not found
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Image not found",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *          application/json:
 *
 *            {
 *                     "message": "Unauthorized",
 *            }
 *
 */

router.get('/image/:image_id', (req, res) => {})

/**
 * @swagger
 * responses:
 *   image:
 *     type: object
 *     properties:
 *       title:
 *         type: string
 *       photo_id:
 *         type: integer
 *       photo_url:
 *         type: string
 *       photo_owner_id:
 *         type: integer
 *       tag:
 *         type: array
 *         items:
 *           $ref: '#/responses/tag'
 *       comment:
 *         type: array
 *         items:
 *           $ref: '#/responses/comment'
 *       description:
 *         type: string
 *       favs:
 *         type: object
 *
 */
/**
 * @swagger
 * responses:
 *   comment:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       comment:
 *         type: string
 *       photo_id:
 *         type: integer
 *       commented_user_id:
 *         type: integer
 *   tag:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       comment:
 *         type: string
 *       photo_id:
 *         type: integer
 *       taged_user_id:
 *         type: integer
 *
 *   user_image:
 *     type: object
 *     properties:
 *       photo_id:
 *         type: integer
 *       photo_url:
 *         type: string
 *       photo_owner_id:
 *         type: integer
 *       num_favs:
 *         type: integer
 *       num_views:
 *         type: integer
 *       photo_owner_name:
 *         type: string
 *       title:
 *         type: string
 *       privacy:
 *         type: boolean
 *
 *       description:
 *         type: string
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */

module.exports = router
