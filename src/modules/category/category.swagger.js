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
 *              properties:
 *                  title:
 *                      type: string
 *                      description: The title of the category
 *                      example: "Men's Clothing"
 *                  slug:
 *                      type: string
 *                      description: The slug for the category (optional, will be auto-generated from title)
 *                      example: "mens-clothing"
 *                  icon:
 *                      type: string
 *                      description: The icon identifier for the category
 *                      example: "mens-icon"
 *                  photo:
 *                      type: string
 *                      format: binary
 *                      description: The photo file for the category (optional)
 *                  parent:
 *                      type: string
 *                      description: The parent category ID (optional)
 *                      example: "507f1f77bcf86cd799439011"
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CategoryResponse:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: integer
 *                      example: 201
 *                  data:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "دسته بندی با موفقیت ایجاد شد"
 *                          category:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "507f1f77bcf86cd799439011"
 *                                  title:
 *                                      type: string
 *                                      example: "Men's Clothing"
 *                                  slug:
 *                                      type: string
 *                                      example: "mens-clothing"
 *                                  icon:
 *                                      type: string
 *                                      example: "mens-icon"
 *                                  photo:
 *                                      type: string
 *                                      example: "https://example.com/categories/mens-clothing.jpg"
 *                                  parent:
 *                                      type: string
 *                                      example: "507f1f77bcf86cd799439012"
 *                                  children:
 *                                      type: array
 *                                      items:
 *                                          type: object
 */

/**
 * @swagger
 * /category:
 *  post:
 *      summary: Create a new category
 *      tags:
 *          -   Category
 *      security:
 *          -   bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   title
 *                      properties:
 *                          title:
 *                              type: string
 *                              description: The title of the category
 *                              example: "Men's Clothing"
 *                          slug:
 *                              type: string
 *                              description: The slug for the category (optional)
 *                              example: "mens-clothing"
 *                          icon:
 *                              type: string
 *                              description: The icon identifier for the category
 *                              example: "mens-icon"
 *                          photo:
 *                              type: string
 *                              format: binary
 *                              description: The photo file for the category (optional)
 *                          parent:
 *                              type: string
 *                              description: The parent category ID (optional)
 *                              example: "507f1f77bcf86cd799439011"
 *      responses:
 *          201:
 *              description: Category created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/CategoryResponse'
 *          400:
 *              description: Bad request - validation error
 *          401:
 *              description: Unauthorized - authentication required
 *          403:
 *              description: Forbidden - insufficient permissions
 */

/**
 * @swagger
 * /category:
 *  get:
 *      summary: Get all categories
 *      tags:
 *          -   Category
 *      responses:
 *          200:
 *              description: Categories retrieved successfully
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
 *                                      categories:
 *                                          type: array
 *                                          items:
 *                                              type: object
 *                                              properties:
 *                                                  _id:
 *                                                      type: string
 *                                                      example: "507f1f77bcf86cd799439011"
 *                                                  title:
 *                                                      type: string
 *                                                      example: "Men's Clothing"
 *                                                  slug:
 *                                                      type: string
 *                                                      example: "mens-clothing"
 *                                                  icon:
 *                                                      type: string
 *                                                      example: "mens-icon"
 *                                                  photo:
 *                                                      type: string
 *                                                      example: "https://example.com/categories/mens-clothing.jpg"
 *                                                  children:
 *                                                      type: array
 *                                                      items:
 *                                                          type: object
 */

/**
 * @swagger
 * /category/{id}:
 *  delete:
 *      summary: Delete a category
 *      tags:
 *          -   Category
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: id
 *              required: true
 *              schema:
 *                  type: string
 *              description: The category ID
 *              example: "507f1f77bcf86cd799439011"
 *      responses:
 *          200:
 *              description: Category deleted successfully
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
 *                                          example: "دسته بندی با موفقیت حذف شد"
 *          400:
 *              description: Bad request - invalid category ID
 *          401:
 *              description: Unauthorized - authentication required
 *          403:
 *              description: Forbidden - insufficient permissions
 *          404:
 *              description: Category not found
 */