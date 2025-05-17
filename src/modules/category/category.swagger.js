/**
 * @swagger
 * tags:
 *  name: Category
 *  description: Category module and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateCategory:
 *              type: object
 *              required: 
 *                  -   title
 *                  -   icon
 *              properties:
 *                  title:
 *                      type: string
 *                      example: ""
 *                  slug:
 *                      type: string
 *                      example: ""
 *                  icon:
 *                      type: string
 *                      example: ""
 *                  parent:
 *                      type: string
 *                      example: ""
 *                  
 */


/**
 * @swagger
 * /category:
 *  post:
 *      summary: create new category
 *      tags:
 *          -   Category
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategory'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateCategory'
 *      responses:
 *          201:
 *              description: created
 */
/**
 * @swagger
 * /category:
 *  get:
 *      summary: get all category
 *      tags:
 *          -   Category
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *      summary: delete category
 *      tags:
 *          -   Category
 *      parameters:
 *          -   in: path
 *              name: id
 *              example: ""
 *      responses:
 *          200:
 *              description: success
 */