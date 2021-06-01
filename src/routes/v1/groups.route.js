const express = require('express');
const groupsController = require('../../controllers/group.controller');
const { authentication } = require('../../middlewares/auth');
const { isMember } = require('../../middlewares/group');
const router = express.Router();
router.use((req, res, next) => {
  authentication(req, res, next);
});
/**
 * @swagger
 * /group:
 *   post:
 *     description: Create new group
 *     tags: [Group]
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: Group data
 *         type: object
 *         properties:
 *           group_name:
 *             type: string
 *     responses:
 *       200:
 *         description: Success
 *
 *         examples:
 *           application/json:
 *             {
 *                     "group_id": "{group_id}",
 *             }
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

router.post('/', (req, res) => {
  groupsController.createGroup(req, res);
});

/**
 * @swagger
 * /group/{group_id}:
 *   get:
 *     description: get a group by id
 *     tags: [Group]
 *     parameters:
 *       - name: group_id
 *         in: path
 *         required: true
 *         description: Group data
 *
 *     responses:
 *       200:
 *         description: Success
 *
 *         examples:
 *           application/json:
 *              {
 *                  "_id": "608c80ce54e3d74b34d9bb5a",
 *                  "privacy": "public",
 *                  "visibility": "public",
 *                  "name": "ABC",
 *                  "createdAt": "2021-05-30T14:14:40.691Z",
 *                  "role": "admin",
 *                  "count_members": 1,
 *                  "count_photos": 0
 *             }
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

router.get('/:group_id', (req, res) => {
  groupsController.getGroup(req, res);
});
/**
 * @swagger
 * /group/photo:
 *   post:
 *     description: Add photo to group
 *     tags: [Group]
 *     parameters:
 *       - name: data
 *         in: body
 *         required: true
 *         description: photo and group data
 *         type: object
 *         properties:
 *           group_id:
 *             type: integer
 *           photo_id:
 *             type: integer
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *          application/json:
 *
 *            {
 *                     "group_id": "{group_id}",
 *            }
 *       401:
 *         description: Unauthorized request
 *         examples:
 *           application/json:
 *
 *
 *             {
 *                     "message": "Unauthorized",
 *             }
 *       404:
 *         description: Not found
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Group/photo not found",
 *             }
 *
 */
router.post('/photo', isMember, groupsController.addPhoto);
/**
* @swagger
* /group/members/{group_id}:
*   get:
*     description: get group by id
*     tags: [Group]
*     parameters:
*       - name: group_id
*         in: path
*         required: true
*         description: group id
*         schema:
*           type: string
      
*     responses:
*       200: 
*         description: Success
*         schema: 
*           type: array
*           items:
*             $ref: '#/responses/members'
*         
*       
*       404:
*         description: Not found
*         examples:
*           application/json:
*            
*             {
*                     "message": "Group not found",
*             }
*
*
*
*/
router.get('/members/:id', (req, res) => {
  groupsController.getGroupMembers(req, res);
});
/**
* @swagger
* /group/photos/{group_id}:
*   get:
*     description: get group photos
*     tags: [Group]
*     parameters:
*       - name: group_id
*         in: path
*         required: true
*         description: group id
*         schema:
*           type: string
      
*     responses:
*       200: 
*         description: Success
*         schema: 
*           type: array
*           items:
*             $ref: '#/responses/photo'
*         
*       
*       404:
*         description: Not found
*         examples:
*           application/json:
*            
*             {
*                     "message": "photo not found",
*             }
*        
*       
*
*/
router.get('/photos/:id', (req, res) => {
  groupsController.getGroupPhotos(req, res);
});
/**
 * @swagger
 * /group/{group_id}/join:
 *   post:
 *     description: Join group
 *     tags: [Group]
 *     parameters:
 *       - name: group_id
 *         in: path
 *         required: true
 *         description: group id
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref: addRefHere
 *
 *
 *       404:
 *         description: Not found
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Group not found",
 *             }
 *       401:
 *         description: Unauthorized access
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Unauthorized request",
 *             }
 *
 *
 *
 */
router.post('/:group_id/join', (req, res) => groupsController.join(req, res));

/**
 * @swagger
 * /group/{group_id}/leave:
 *   delete:
 *     description: Leave group
 *     tags: [Group]
 *     parameters:
 *       - name: group_id
 *         in: path
 *         required: true
 *         description: group id
 *         schema:
 *           type: int
 *     responses:
 *       200:
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             $ref: addRefHere
 *
 *
 *       404:
 *         description: Not found
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Group not found",
 *             }
 *       401:
 *         description: Unauthorized access
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Unauthorized request",
 *             }
 *       500:
 *         description: Unauthorized access
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "User is not a member of the group",
 *             }
 *
 *
 *
 */
router.delete('/:group_id/leave', (req, res) => {
  groupsController.leave(req, res);
});
/**
 * @swagger
 * /group/{keyword}/search:
 *   get:
 *     description: Search groups
 *     tags: [Group]
 *     parameters:
 *       - name: keyword
 *         in: path
 *         required: true
 *         description: search keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         examples:
 *           application/json:
 *            [
 *              {
 *                description: null,
 *                privacy: 'public',
 *                visibility: 'public',
 *                id: '608c80ce54e3d74b34d9bb5a',
 *               name: 'ABC',
 *                num_photos: 0,
 *                num_members: 1,
 *               role: 'member'
 *              }
 *            ]
 *
 *       404:
 *         description: Not found
 *         examples:
 *           application/json:
 *
 *             {
 *                     "message": "Group not found",
 *             }
 *
 */
router.get('/:keyword/search', (req, res) => {
  groupsController.searchGroup(req, res);
});

/**
 * @swagger
 * responses:
 *  GroupSearch:
 *    type: object
 *    properties:
 *      name:
 *        type: string
 *      date_joined:
 *        type: string
 *        format: date
 *      num_members:
 *        type: integer
 *        format: int32
 *      num_photos:
 *        type: integer
 *        format: int32
 *
 *
 *  members:
 *    type: object
 *    properties:
 *      Fname:
 *        type: string
 *      Lname:
 *        type: string
 *      email:
 *        type: string
 *
 *      num_photos:
 *        type: integer
 *        format: int32
 *      num_following:
 *        type: integer
 *        format: int32
 *
 */
module.exports = router;
