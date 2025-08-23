/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Cart module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CartItem:
 *              type: object
 *              required:
 *                  -   productId
 *                  -   quantity
 *              properties:
 *                  productId:
 *                      type: string
 *                      description: Product ID to add to cart
 *                      example: "507f1f77bcf86cd799439011"
 *                  quantity:
 *                      type: integer
 *                      minimum: 1
 *                      description: Quantity of the product
 *                      example: 2
 *          
 *          Cart:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: Cart ID
 *                      example: "507f1f77bcf86cd799439011"
 *                  userId:
 *                      type: string
 *                      description: User ID who owns the cart
 *                      example: "507f1f77bcf86cd799439012"
 *                  items:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              id:
 *                                  type: string
 *                                  description: Cart item ID
 *                              productId:
 *                                  type: object
 *                                  description: Product information
 *                                  properties:
 *                                      _id:
 *                                          type: string
 *                                          description: Product ID
 *                                      name:
 *                                          type: string
 *                                          description: Product name
 *                                      price:
 *                                          type: number
 *                                          description: Product price
 *                              quantity:
 *                                  type: integer
 *                                  description: Quantity of the product
 *                  totalItems:
 *                      type: integer
 *                      description: Total number of items in cart
 *                  expiresAt:
 *                      type: string
 *                      format: date-time
 *                      description: When the cart expires
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: When the cart was created
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: When the cart was last updated
 */                 

/**
 * @swagger
 * /cart/add:
 *  post:
 *      summary: Add item to cart
 *      description: Add a new item to the cart
 *      tags:
 *          -   Cart
 *      security:
 *          -   bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CartItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CartItem'
 *      responses:
 *          201:
 *              description: Item added to cart successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              statusCode:
 *                                  type: integer
 *                                  example: 201
 *                              data:
 *                                  type: object
 *                                  properties:
 *                                      cart:
 *                                          $ref: '#/components/schemas/Cart'
 *                                      message:
 *                                          type: string
 *                                          example: "Item added to cart successfully"
 *          400:
 *              description: Invalid request or insufficient stock
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /cart/update:
 *  put:
 *      summary: Update item quantity
 *      description: Update the quantity of an item in the cart
 *      tags:
 *          -   Cart
 *      security:
 *          -   bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CartItem'
 *      responses:
 *          200:
 *              description: Cart updated successfully
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
 *                                      cart:
 *                                          $ref: '#/components/schemas/Cart'
 *          400:
 *              description: Invalid request
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Cart or item not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /cart:
 *  get:
 *      summary: Get cart
 *      description: Retrieve the current cart contents
 *      tags:
 *          -   Cart
 *      security:
 *          -   bearerAuth: []
 *      responses:
 *          200:
 *              description: Cart retrieved successfully
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
 *                                      cart:
 *                                          $ref: '#/components/schemas/Cart'
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Cart not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /cart/clear-cart:
 *  get:
 *      summary: Clear cart
 *      description: Remove all items from the cart
 *      tags:
 *          -   Cart
 *      security:
 *          -   bearerAuth: []
 *      responses:
 *          200:
 *              description: Cart cleared successfully
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
 *                                          example: "Cart cleared successfully"
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Cart not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /cart/remove/{productId}:
 *  delete:
 *      summary: Remove item from cart
 *      description: Remove a specific item from the cart
 *      tags:
 *          -   Cart
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: productId
 *              type: string
 *              required: true
 *              description: Product ID to remove from cart
 *              example: "507f1f77bcf86cd799439011"
 *      responses:
 *          200:
 *              description: Item removed from cart successfully
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
 *                                      cart:
 *                                          $ref: '#/components/schemas/Cart'
 *                                      message:
 *                                          type: string
 *                                          example: "Item removed from cart successfully"
 *          400:
 *              description: Invalid request
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Cart or item not found
 *          500:
 *              description: Internal server error
 */



