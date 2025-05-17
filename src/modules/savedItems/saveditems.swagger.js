/**
 * @swagger
 * tags:
 *  name: SavedItems
 *  description: SavedItems module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          SavedItem:
 *              type: object
 *              required:
 *                  -   productId
 *              properties:
 *                  productId:
 *                      type: string
 *                      example: ""
 * 
 */                 

/**
 * @swagger
 * /saved-items/save:
 *  post:
 *      summary: save item for later
 *      description: save an item for later
 *      tags:
 *          -   SavedItems
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *      responses:
 *          201:
 *              description: Item added to cart successfully
 *          400:
 *              description: invalid request
 */
/**
 * @swagger
 * /saved-items/move-to-cart:
 *  post:
 *      summary: move saved item to cart
 *      description: move a saved item to cart
 *      tags:
 *          -   SavedItems
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /saved-items:
 *  get:
 *      summary: get all saved items
 *      description: view all saved items
 *      tags:
 *          -   SavedItems
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: InternalServerError
 */

/**
 * @swagger
 * /saved-items/remove:
 *  post:
 *      summary: remove an item 
 *      description: Remove an item from the saved items
 *      tags:
 *          -   SavedItems
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /saved-items/clear:
 *  delete:
 *      summary: clear all items 
 *      description: clear all saved items
 *      tags:
 *          -   SavedItems
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /saved-items/is-saved:
 *  post:
 *      summary: check if an item is saved 
 *      description: check if an item is saved 
 *      tags:
 *          -   SavedItems
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SavedItem'
 *      responses:
 *          200:
 *              description: success
 */





