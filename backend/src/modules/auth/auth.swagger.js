/**
 * @swagger
 * tags:
 *  name: Authentication
 *  description: Auth module and routes
 */


/**
 * @swagger
 *  components:
 *      schemas:
 *          GetOTP:
 *              type: object
 *              required: 
 *                  -   mobile
 *              properties:
 *                  mobile:
 *                      type: string
 *                      example: ""
 *          CheckOTP:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   code
 *              properties:
 *                  mobile:
 *                      type: string
 *                      example: ""
 *                  code:
 *                      type: string
 *                      example: ""
 */

/**
 * @swagger
 * /auth/get-otp:
 *  post:
 *      summary: login with otp
 *      tags:
 *          -   Authentication
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/GetOTP' 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/GetOTP' 
 *      responses:
 *          200:
 *              description: success
 * 
 */
/**
 * @swagger
 * /auth/check-otp:
 *  post:
 *      summary: check otp for login user
 *      tags:
 *          -   Authentication
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CheckOTP' 
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CheckOTP' 
 *      responses:
 *          200:
 *              description: success
 * 
 */

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *      summary: check otp for login user
 *      tags:
 *          -   Authentication
 *      responses:
 *          200:
 *              description: success
 * 
 */

/**
 * @swagger
 * /auth/logout:
 *  post:
 *      summary: logout user
 *      tags:
 *          -   Authentication
 *      responses:
 *          200:
 *              description: success 
 */