export const setup=(app)=>{
/**
* @swagger
* /album:
*   post:
*     tags: [album]
*     description: Create new album.
*     responses:
*       200: 
*         description: Success
*         examples:
*          application/json:
*             
*            [
*              {
*                           "photo_id": 0,
*                           "photo_url": "http://localhost:3000/images/image.png",
*                           "tag": "$$$$",
*                           "title": "Photo 1"
*               },
*               {
*                           "photo_id": 1,
*                           "photo_url": "http://localhost:3000/images/image2.png",
*                           "tag": "$$$$",
*                           "title": "Photo 2"
*               }
*            ]
*       401:
*         description: Unauthorized
*         examples:
*          application/json:
*             
*            {
*                       "message": "User is not authorized to create album",
*            }
*       500:
*         description: Internal Server error
*         examples:
*          application/json:
*             
*            {
*                       "message": "Parameter missing",
*            }
*     parameters:
*       - name: body
*         in: body
*         required: true
*         description: Album title and description
*         schema: 
*           $ref: '#/definitions/Album'     
*/

 app .get("/album",(req,res)=>
 {
   


});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* @swagger
* /album/{album_id}:
*   delete:
*     tags: [album]
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
*                       "message": "Album not found",
*            }
*       401:
*         description: Unauthorized
*         examples:
*          application/json:
*             
*            {
*                       "message": "Unauthorized request",
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

app .delete("/album",(req,res)=>
{
  


});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* @swagger
* /album:
*   put:
*     tags: [album]
*     description: Update album.
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
*                       "message": "Album not found",
*            }
*       422:
*         description: Mising update parameters
*         examples:
*          application/json:
*             
*            {
*                       "message": "Mising update parameters",
*            }
*     parameters:
*       - name: album_title
*         in: body
*         required: true
*         description: album id
*         schema: 
*           $ref: '#/definitions/EditAlbum'
*           photo_id:
*               type: integer
*  
*/

app .put("/album/",(req,res)=>
{
  


});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* @swagger
* /album/{album_id}:
*   get:
*     tags: [album]
*     description: Return album by ID.
*     responses:
*       200: 
*         description: Success
*         schema:  
*           type: array
*           items:
*             $ref: '#/responses/image'
*  
*       404:
*         description: Not found
*         examples:
*          application/json:
*            
*            {
*                       "message": "Album not found",
*            }
*       500:
*         description: No value passed
*         examples:
*          application/json:
*             
*            {
*                       "message": "Album id not sent",
*            }
*     parameters:
*       - name: album_id
*         in: path
*         required: true
*         description: album id
*         schema: 
*           type: integer
*           format: int32                 
*/

app.get("/album/:album_id",(req,res)=>
{
  


});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @swagger
 * 
 *definitions:
 *  Album:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      primary_photo_id:
 *        type: array
 *        items:
 *          type: integer  
 *  EditAlbum:
 *    type: object
 *    properties:
 *      album_id:
 *        type: integer
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









}
