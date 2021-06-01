const express = require('express');
const router = express.Router();
const UserController=require("../../controllers/user.controller");
const auth=require("../../middlewares/auth");
const { use, route } = require('./album.route');
//schemas
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *
 *       username:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       age:
 *         type: integer
 *
 *   UserLogin:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *
 *   Avatar:
 *     type: object
 *     properties:
 *       photo_id:
 *         type: integer
 */
/**
 * @swagger
 *
 * responses:
 *   UserById:
 *     type: object
 *     properties:
 *       num_following:
 *         type: integer
 *         format: int32
 *       num_followers:
 *         type: integer
 *         format: int32
 *       num_views:
 *         type: integer
 *         format: int32
 *       date_joined:
 *         type: string
 *         format: date
 *       country:
 *         type: string
 *       num_public_photos:
 *         type: integer
 *
 *   UserByName:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *       Fname:
 *         type: string
 *       Lname:
 *         type: string
 *       num_following:
 *         type: integer
 *         format: int32
 *       num_followers:
 *         type: integer
 *         format: int32
 *       num_views:
 *         type: integer
 *         format: int32
 *       date_joined:
 *         type: string
 *         format: date
 *       country:
 *         type: string
 *
 *   UserAbout:
 *     type: object
 *     properties:
 *       num_views:
 *         type: integer
 *         format: int32
 *       num_tag:
 *         type: integer
 *         format: int32
 *       num_geotag:
 *         type: integer
 *         format: int32
 *       num_favs:
 *         type: integer
 *         format: int32
 *       num_groups:
 *         type: integer
 *         format: int32
 *       date_joined:
 *         type: string
 *         format: date
 *       email:
 *         type: string
 *   follower:
 *     type: object
 *     properties:
 *       Fname:
 *         type: string
 *       username:
 *         type: string
 *       Lname:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       id:
 *         type: integer
 *         format: int32
 *
 *       num_photos:
 *         type: integer
 *         format: int32
 *       relation:
 *         type: string
 *
 */
// export const setup = (router) => {
  /**
  * @swagger
  * /user:
  *   put: 
  *     description: Update user
  *     tags: [User]
  *     parameters:
  *       - name: data
  *         in: body
  *         required: true
  *         description: User object
  *         type: object
  *         properties:
  *           Fname:
  *             type: string
  *           Lname:
  *             type: string
  *           email:
  *             type: string
  *             format: email
  *           password:
  *             type: string
  *             format: password
  *     responses:
  *       200: 
  *         description: Success
  *         examples:
  *          application/json:
  *             
  *            {
  *                     "message": "User updated successfully",
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
  *                     "message": "User not found",
  *            }
  */
  
  
  
  
  
  router.put("/",auth.authentication,UserController.UpdateUser);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /**
  * @swagger
  * /user:
  *   delete:
  *     description: Delete user 
  *     tags: [User]
  *     parameters:
  *       - name: user_id
  *         in: url
  *         required: true
  *         type: integer
  *     responses:
  *       200: 
  *         description: Success
  *         examples:
  *          application/json:
  *            
  *            {
  *                     "message": "User deleted successfully",
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
  *                     "message": "User not found",
  *            }
  */
  
  
  
  
  
  /**
  * @swagger
  * /user:
  *   post:
  *     tags: [User]
  *     description: Create a new user.
  *     responses:
  *       201: 
  *         description: Created successfully
  *         examples:
  *           application/json:
  *             
  *             {
  *                     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  *             }
  *       500: 
  *         description: Failed to create user
  *         examples:
  *           application/json:
  *             
  *             {
  *                     "message": "Failed to create user"
  *             }
  *       422: 
  *         description: User already exists
  *         examples:
  *           application/json:
  *             
  *             {
  *                     "message": "User already exists"
  *             }
  * 
  *     parameters:
  *       - in: body
  *         name: body
  *         description: user data
  *         required: true
  *         schema:
  *           $ref: '#/definitions/User'
  *    
  *   
  *     
  */
  
  router.post("/",UserController.register,auth.SendVerification );

  router.get('/verify/:token',UserController.VerifyEmail);
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  
  router.post("/login",UserController.login,auth.authorization);
  
      
      
      
   router.get("/",auth.authentication,UserController.GetUser);


   //post new follower to the user

   router.post("/follow",auth.authentication,UserController.PostFollower);
   //post new follower to the user

   router.delete("/unfollow/:peopleid",auth.authentication,UserController.Unfollow);

   // return list of followers
   router.get("/followers",auth.authentication,UserController.GetFollowers)
   // return list of following
   router.get("/following",auth.authentication,UserController.GetFollowing)
   // return list of user photos
   router.get("/photos",auth.authentication,UserController.UserPhotos);
   //check if user
   router.get("/check/:peopleid",auth.authentication,auth.IfUser);
   //explore/android
   router.get("/explore",auth.authentication,UserController.Explore);
   //update user about
   router.put("/about",auth.authentication,UserController.UpdateAbout);
   router.get("/fav",auth.authentication,UserController.GetFav);
   router.get("/album",auth.authentication,UserController.Album);

   
  
  
      
      
      
   router.get("/about",auth.authentication,UserController.About);
  
  
  
  module.exports=router;
