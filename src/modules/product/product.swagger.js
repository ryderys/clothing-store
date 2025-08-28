/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Product Module and Routes
 */
/**
 * @swagger
 *  definitions:
 *      publicDefinition:
 *          type: object
 *          properties:
 *              statusCode:                 
 *                  type: integer
 *                  example: 20X
 *              data:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "the best message for that action"
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          addProduct:
 *              type: object
 *              required:
 *                  - title
 *                  - summary
 *                  - description
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: ""
 *                  summary:
 *                      type: string
 *                      description: the summary of product
 *                      example: ""
 *                  description:
 *                      type: string
 *                      description: the description of product
 *                      example: ""
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: ""
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: ""
 *                  count:
 *                      type: number
 *                      description: the quantity/stock count of product
 *                      example: 100
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *          Edit-Product:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: ""
 *                  summary:
 *                      type: string
 *                      description: the summary of product
 *                      example: ""
 *                  description:
 *                      type: string
 *                      description: the description of product
 *                      example: ""
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: ""
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: ""
 *                  count:
 *                      type: number
 *                      description: the quantity/stock count of product
 *                      example: 100
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 */

/**
 * @swagger
 *  /products/add:
 *  post:
 *      summary: add new product
 *      tags:
 *          - Product
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/addProduct'
 *      responses:
 *          201:
 *              description: created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 */
/**
 * @swagger
 *  /products/edit/{id}:
 *  patch:
 *      summary: edit product by id
 *      tags:
 *          - Product
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              required: true
 *              example: ""
 *              description: id of the product
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/Edit-Product'
 *      responses:
 *          201:
 *              description: created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /products/all:
 *  get:
 *      summary: get all products
 *      tags:
 *          -   Product
 *      parameters:
 *          -   in: query
 *              name: search
 *              type: string
 *              example: ""
 *              description: for searching in title, summary, description of the product
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 *  /products/{id}:
 *  get:
 *      summary: get one product by id
 *      tags:
 *          -   Product
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              example: ""
 *              description: id of the product
 *      responses:
 *          200:
 *              description: success
 */

/**
 * @swagger
 *  /products/remove/{id}:
 *  delete:
 *      summary: delete one product by id
 *      tags:
 *          -   Product
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              example: ""
 *              description: id of the product
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 */