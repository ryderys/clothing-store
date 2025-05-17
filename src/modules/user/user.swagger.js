/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-Profile:
 *              type: object
 *              properties:
 *                  fullName:
 *                      type: string
 *                      example: ""
 *                      description: the fullname of user
 *                  username:
 *                      type: string
 *                      example: ""
 *                      description: the username of user
 *                  email:
 *                      type: string
 *                      example: ""
 *                      description: the email of user
*/                  


/**
 * @swagger
 * /user/all:
 *  get:
 *      summary: get all users
 *      description: get list of users
 *      tags:
 *          -   Users
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */
/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: get profile of user
 *      description: get user profile
 *      tags:
 *          -   Users
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /user/update-profile:
 *  patch:
 *      summary: update a user profile
 *      description: update details of user profile
 *      tags:
 *          -   Users
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Update-Profile'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Update-Profile'
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

