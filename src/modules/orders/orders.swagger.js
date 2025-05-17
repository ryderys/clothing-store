/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Order module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Orders:
 *              type: object
 *              required:
 *                  -   cardId
 *              properties:
 *                  cardId:
 *                      type: string
 *                      example: ""
 */                  

/**
 * @swagger
 * /orders:
 *  post:
 *      summary: create order
 *      description: create order section
 *      tags:
 *          -   Orders
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Orders'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Orders'
 *      responses:
 *          201:
 *              description: created order successfully
 *          400:
 *              description: invalid request
 */
/**
 * @swagger
 * /orders:
 *  get:
 *      summary: get orders
 *      description: get orders of user
 *      tags:
 *          -   Orders
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /orders/history:
 *  get:
 *      summary: get history
 *      description: get orders of user
 *      tags:
 *          -   Orders
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /orders/{orderId}/track:
 *  get:
 *      summary: track order of user
 *      description: track order of user
 *      tags:
 *          -   Orders
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              example: ""
 *              required: true
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */
/**
 * @swagger
 * /orders/{orderId}/cancel:
 *  put:
 *      summary: cancel order of user
 *      description: cancel order of user
 *      tags:
 *          -   Orders
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              example: ""
 *              required: true
 *      responses:
 *          200:
 *              description: success
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /orders/{orderId}:
 *  get:
 *      summary: get order by id
 *      description: get user order by id
 *      tags:
 *          -   Orders
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              example: ""
 *              description: id of the order
 *              required: true
 *      responses:
 *          200:
 *              description: success
 *          500:
 *              description: InternalServerError
 */









