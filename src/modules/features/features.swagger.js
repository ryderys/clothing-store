/**
 * @swagger
 * tags:
 *  name: Feature
 *  description: Features module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateFeature:
 *              type: object
 *              required:
 *                  -   title
 *                  -   key
 *                  -   type
 *                  -   category
 *              properties:
 *                  title:
 *                      type: string
 *                      example: ""
 *                  key:
 *                      type: string
 *                      example: ""
 *                  category:
 *                      type: string
 *                      example: ""
 *                  guid:
 *                      type: string
 *                      example: ""
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 *          UpdateFeature:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      example: ""
 *                  key:
 *                      type: string
 *                      example: ""
 *                  category:
 *                      type: string
 *                      example: ""
 *                  guid:
 *                      type: string
 *                      example: ""
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 */

/**
 * @swagger
 * /feature:
 *  post:
 *      summary: create new feature for category
 *      tags:
 *          -   Feature
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateFeature'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateFeature'
 *      responses:
 *          201:
 *              description: created
 */

/**
 * @swagger
 * /feature/{id}:
 *  put:
 *      summary: update feature for category
 *      tags:
 *          -   Feature
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              example: ""
 *              required: true
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateFeature'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateFeature'
 *      responses:
 *          201:
 *              description: created
 */

/**
 * @swagger
 * /feature:
 *  get:
 *      summary: get all features
 *      tags:
 *          -   Feature
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 * /feature/by-category/{categoryId}:
 *  get:
 *      summary: get all features of a category
 *      tags:
 *          -   Feature
 *      parameters:
 *          -   in: path
 *              name: categoryId
 *              type: string
 *              example: ""
 *      responses:
 *          200:
 *              description: success
 *      
 */
/**
 * @swagger
 * /feature/by-category-slug/{slug}:
 *  get:
 *      summary: find feature by category slug
 *      tags:
 *          -   Feature
 *      parameters:
 *          -   in: path
 *              name: slug
 *              type: string
 *              example: ""
 *      responses:
 *          200:
 *              description: success
 *      
 */

/**
 * @swagger
 * /feature/{id}:
 *  delete:
 *      summary: delete feature by id
 *      tags:
 *          -   Feature
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              example: ""
 *      responses:
 *          200:
 *              description: success
 *      
 */



