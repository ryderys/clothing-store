/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: Cart module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Cart:
 *              type: object
 *              required:
 *                  -   productId
 *                  -   quantity
 *              properties:
 *                  productId:
 *                      type: string
 *                      example: ""
 *                  quantity:
 *                      type: integer
 *                      example: ""
 * 
 */                 

/**
 * @swagger
 * /cart/add:
 *  post:
 *      summary: add item to cart
 *      description: add a new item to the cart
 *      tags:
 *          -   Cart
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Cart'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Cart'
 *      responses:
 *          201:
 *              description: Item added to cart successfully
 *          400:
 *              description: invalid request
 */
/**
 * @swagger
 * /cart/update:
 *  put:
 *      summary: update item quantity
 *      description: Update the quantity of an item in the cart
 *      tags:
 *          -   Cart
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Cart'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Cart'
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /cart:
 *  get:
 *      summary: get cart
 *      description: Retrieve the current cart contents
 *      tags:
 *          -   Cart
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Cart'
 *          500:
 *              description: InternalServerError
 */

/**
 * @swagger
 * /cart/clear-cart:
 *  get:
 *      summary: clear cart
 *      description: Remove all items from the cart
 *      tags:
 *          -   Cart
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /cart/remove/{productId}:
 *  delete:
 *      summary: remove item from cart
 *      description: Remove a specific item from the cart
 *      tags:
 *          -   Cart
 *      parameters:
 *          -   in: path
 *              name: productId
 *              required: true
 *              type: string
 *              example: ""
 *              description: The ID of the item to remove
 *      responses:
 *          200:
 *              description: success
 *      
 */



