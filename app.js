import express from 'express';
import swaggerui  from 'swagger-ui-express';
import bodyParser from 'body-parser'
import swaggerJsdoc from 'swagger-jsdoc';
import { setup as setupGallery } from './routes/galleries.js';
import { setup as setupGroups } from './routes/groups.js';
import { setup as setupImage } from './routes/image.js';
import { setup as setupPeople } from './routes/people.js';
import { setup as setupUser } from './routes/user.js';
import { setup as setupFavs } from './routes/favs.js';
import { setup as setupAlbums } from './routes/album.js';
const options = {
  definition: {
    
    info: {
      title: 'Dropoid API specification',
      version: '1.0.0',
      host: 'localhost:3000', 
      basePath: '/api/v1',
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const openapiSpecification =  await swaggerJsdoc(options);
//console.log(swaggerJsdoc.options);
const app=express();

/**
* @swagger
*tags:  
*    -name:People
*     description:Api collection considering peoples
*    -name:User
*     description:Api considering user 
*    -name:Gallery
*     description:Api considering gallery
*    -name:Image
*     description:Api considering image
*    -name:Group
*     description:Api considering group
*    -name:Favs
*     description:API endpoints considering favs
*    -name:Album
*     description:Album api endpoints
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.use(bodyParser.json());

app.use('/api-docs', swaggerui.serve, swaggerui.setup(openapiSpecification));
setupGallery(app)
setupGroups(app)
setupImage(app)
setupPeople(app)
setupUser(app)
setupFavs(app)
setupAlbums(app)


app.listen(3000,()=>{
console.log("start listening");
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


