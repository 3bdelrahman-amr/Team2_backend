export const setup = (router) => {
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





router.post("/",(req,res)=>{



});




/**
* @swagger
* /group/{group_id}:
*   get:
*     description: get a group by id
*     tags: [Group]
*     parameters:
*       - name: data
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
*             {
*                     "description": "string",
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





router.post("/",(req,res)=>{



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
*         description: Image and group data
*         type: object
*         properties:
*           group_id:
*             type: integer
*           image_id:
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
*                     "message": "Group/Image not found",
*             }
*
*/





router.post("/photo",(req,res)=>{



});

/**
* @swagger
* /group:
*   delete:
*     description: Leave group
*     tags: [Group]
*     parameters:
*       - name: data
*         in: body
*         required: true
*         description: User and group data
*         type: object
*         properties:
*           group_id:
*             type: integer
*     responses:
*       200: 
*         description: Success
*         examples:
*          application/json:
*           
*            {
*                     "message": "Group left successfully",
*            }
*       401:
*         description: Unauthorized request
*         examples:
*          application/json:
*             
*            {
*                     "message": "Unauthorized",
*            }
*       404:
*         description: Not found
*         examples:
*           application/json:
*            
*             {
*                     "message": "Group not found",
*             }
*       500:
*         description: User is not a member of the group
*         examples:
*          application/json:
*             
*            {
*                     "message": "User is not a member of the group",
*            }
*
*/





router.delete("/",(req,res)=>{



});
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
router.get("/group",(req,res)=>{



});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
*             $ref: '#/responses/image'
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
router.get("/group",(req,res)=>{



});


}
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
