/**
 * @swagger
 * tags:
 *  name: Users
 *  description: Users module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Address:
 *              type: object
 *              properties:
 *                  street:
 *                      type: string
 *                      description: Street address
 *                      example: "123 Main Street"
 *                  city:
 *                      type: string
 *                      description: City name
 *                      example: "Tehran"
 *                  state:
 *                      type: string
 *                      description: State or province
 *                      example: "Tehran"
 *                  postalCode:
 *                      type: string
 *                      description: Postal code
 *                      example: "12345"
 *                  country:
 *                      type: string
 *                      description: Country name
 *                      example: "Iran"
 *          
 *          Update-Profile:
 *              type: object
 *              properties:
 *                  fullName:
 *                      type: string
 *                      description: The full name of user
 *                      example: "John Doe"
 *                  username:
 *                      type: string
 *                      description: The username of user
 *                      example: "johndoe"
 *                  email:
 *                      type: string
 *                      format: email
 *                      description: The email of user
 *                      example: "john@example.com"
 *                  address:
 *                      $ref: '#/components/schemas/Address'
 *          
 *          User:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: User ID
 *                      example: "507f1f77bcf86cd799439011"
 *                  fullName:
 *                      type: string
 *                      description: User's full name
 *                      example: "John Doe"
 *                  username:
 *                      type: string
 *                      description: User's username
 *                      example: "johndoe"
 *                  email:
 *                      type: string
 *                      description: User's email
 *                      example: "john@example.com"
 *                  mobile:
 *                      type: string
 *                      description: User's mobile number
 *                      example: "09123456789"
 *                  role:
 *                      type: string
 *                      enum: ['admin', 'user', 'quest']
 *                      description: User's role
 *                      example: "user"
 *                  address:
 *                      $ref: '#/components/schemas/Address'
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: User creation date
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: User last update date
*/                  

/**
 * @swagger
 * /user/all:
 *  get:
 *      summary: Get all users
 *      description: Get list of all users (Admin only)
 *      tags:
 *          -   Users
 *      security:
 *          -   bearerAuth: []
 *      responses:
 *          200:
 *              description: Users retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      users:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/User'
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user/profile:
 *  get:
 *      summary: Get user profile
 *      description: Get the authenticated user's profile
 *      tags:
 *          -   Users
 *      security:
 *          -   bearerAuth: []
 *      responses:
 *          200:
 *              description: Profile retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      user:
 *                                          $ref: '#/components/schemas/User'
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: User not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /user/update-profile:
 *  patch:
 *      summary: Update user profile
 *      description: Update the authenticated user's profile information including address
 *      tags:
 *          -   Users
 *      security:
 *          -   bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Update-Profile'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Update-Profile'
 *      responses:
 *          200:
 *              description: Profile updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 200
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      message:
 *                                          type: string
 *                                          example: "Profile updated successfully"
 *                                      user:
 *                                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Bad request - Invalid data or validation failed
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal server error
 */

