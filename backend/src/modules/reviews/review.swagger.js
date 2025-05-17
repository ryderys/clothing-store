/**
 * @swagger
 * tags:
 *  name: Reviews
 *  description: reviews module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Review:
 *              type: object
 *              required:
 *                  -   rating
 *                  -   comment
 *              properties:
 *                  rating:
 *                      type: integer
 *                      description: Rating of a product
 *                      example: ""
 *                  comment:
 *                      type: string
 *                      description: comment on the product
 *                      example: ""
 *          UpdateReview:
 *              type: object
 *              properties:
 *                  rating:
 *                      type: integer
 *                      description: Rating of a product
 *                      example: ""
 *                  comment:
 *                      type: string
 *                      description: comment on the product
 *                      example: ""
 *          ReviewResponse:
 *              type: object
 *              properties:
 *                  reviews:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Review'
 *          ReviewsResponse:
 *              type: object
 *              properties:
 *                  reviews:
 *                      type: array
 *                      items:
 *                          $ref: '#/components/schemas/Review'
 *                  totalReviews:
 *                      type: integer
 *                  totalPages:
 *                      type: integer
 *                  currentPage:
 *                      type: integer
*/                  

/**
 * @swagger
 * /review/product/{productId}:
 *  post:
 *      summary: create a review
 *      description: create review for a product
 *      tags:
 *          -   Reviews
 *      parameters:
 *          -   in: path
 *              name: productId
 *              type: string
 *              required: true
 *              example: ""
 *              description: the ID of the product
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Review'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Review'
 *      responses:
 *          201:
 *              description: created order successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReviewResponse'
 */
/**
 * @swagger
 * /review/product/{productId}:
 *  get:
 *      summary: get reviews
 *      description: get reviews of a product
 *      tags:
 *          -   Reviews
 *      parameters:
 *          -   in: path
 *              name: productId
 *              type: string
 *              example: ""
 *              description: the id of a product
 *          -   in: query
 *              name: page
 *              type: integer
 *              example: ""
 *              description: the page number
 *          -   in: query
 *              name: limit
 *              type: integer
 *              example: ""
 *              description: the number of items per page
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReviewsResponse'
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /review/{reviewId}:
 *  put:
 *      summary: update a review
 *      description: update reviews of a product
 *      tags:
 *          -   Reviews
 *      parameters:
 *          -   in: path
 *              name: reviewId
 *              type: string
 *              example: ""
 *              description: the id of the review
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateReview'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UpdateReview'
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReviewResponse'
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /review/{reviewId}:
 *  delete:
 *      summary: delete a review
 *      description: delete reviews of a product
 *      tags:
 *          -   Reviews
 *      parameters:
 *          -   in: path
 *              name: reviewId
 *              type: string
 *              example: ""
 *              description: the id of the review
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ReviewResponse'
 *          400:
 *              description: invalid request
 */

/**
 * @swagger
 * /review/product/{productId}/average-rating:
 *  get:
 *      summary: get average ratings of a product
 *      description: get average ratings  of a product
 *      tags:
 *          -   Reviews
 *      parameters:
 *          -   in: path
 *              name: productId
 *              type: string
 *              example: ""
 *              description: the id of the product
 *      responses:
 *          200:
 *              description: success
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              averageRating:
 *                                  type: number
 *          400:
 *              description: invalid request
 */

