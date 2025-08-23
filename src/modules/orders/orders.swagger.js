/**
 * @swagger
 * tags:
 *  name: Orders
 *  description: Order module and Routes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *      OrderItem:
 *          type: object
 *          required:
 *              -   productId
 *              -   quantity
 *              -   price
 *          properties:
 *              productId:
 *                  type: string
 *                  description: Product ID
 *                  example: "507f1f77bcf86cd799439011"
 *              quantity:
 *                  type: number
 *                  description: Quantity of the product
 *                  example: 2
 *              price:
 *                  type: number
 *                  description: Price per unit
 *                  example: 150000
 *      
 *      DeliveryAddress:
 *          type: object
 *          required:
 *              -   street
 *              -   city
 *              -   state
 *              -   postalCode
 *          properties:
 *              street:
 *                  type: string
 *                  description: Street address
 *                  example: "123 Main Street"
 *              city:
 *                  type: string
 *                  description: City name
 *                  example: "Tehran"
 *              state:
 *                  type: string
 *                  description: State or province
 *                  example: "Tehran"
 *              postalCode:
 *                  type: string
 *                  description: Postal code
 *                  example: "12345"
 *              country:
 *                  type: string
 *                  description: Country name
 *                  example: "Iran"
 *      
 *      DeliveryInfo:
 *          type: object
 *          properties:
 *              method:
 *                  type: string
 *                  enum: [standard, express, pickup]
 *                  description: Delivery method
 *                  example: "standard"
 *              cost:
 *                  type: number
 *                  description: Delivery cost
 *                  example: 25000
 *              estimatedDays:
 *                  type: number
 *                  description: Estimated delivery days
 *                  example: 3
 *              trackingNumber:
 *                  type: string
 *                  description: Tracking number
 *                  example: "TRK123456789"
 *              notes:
 *                  type: string
 *                  description: Delivery notes
 *                  example: "Leave at front door"
 *      
 *      Order:
 *          type: object
 *          required:
 *              -   userId
 *              -   items
 *              -   totalAmount
 *              -   deliveryAddress
 *          properties:
 *              _id:
 *                  type: string
 *                  description: Order ID
 *                  example: "507f1f77bcf86cd799439011"
 *              userId:
 *                  type: string
 *                  description: User ID who placed the order
 *                  example: "507f1f77bcf86cd799439012"
 *              items:
 *                  type: array
 *                  items:
 *                      $ref: '#/components/schemas/OrderItem'
 *              totalAmount:
 *                  type: number
 *                  description: Total order amount
 *                  example: 325000
 *              deliveryAddress:
 *                  $ref: '#/components/schemas/DeliveryAddress'
 *              delivery:
 *                  $ref: '#/components/schemas/DeliveryInfo'
 *              status:
 *                  type: string
 *                  enum: ['Pending', 'Processing', 'Shipped', 'out for delivery', 'Delivered', 'cancelled']
 *                  description: Order status
 *                  example: "Pending"
 *              createdAt:
 *                  type: string
 *                  format: date-time
 *                  description: Order creation date
 *              updatedAt:
 *                  type: string
 *                  format: date-time
 *                  description: Order last update date
 */

/**
 * @swagger
 * /orders:
 *  get:
 *      summary: Get user orders
 *      description: Get all orders for the authenticated user
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      responses:
 *          200:
 *              description: Orders retrieved successfully
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
 *                                      order:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/Order'
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders/history:
 *  get:
 *      summary: Get user order history
 *      description: Get paginated order history for the authenticated user
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: query
 *              name: page
 *              type: integer
 *              description: "Page number (default: 1)"
 *              example: 1
 *          -   in: query
 *              name: limit
 *              type: integer
 *              description: "Items per page (default: 10)"
 *              example: 10
 *      responses:
 *          200:
 *              description: Order history retrieved successfully
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
 *                                      orders:
 *                                          type: array
 *                                          items:
 *                                              $ref: '#/components/schemas/Order'
 *                                      totalOrders:
 *                                          type: integer
 *                                          example: 25
 *                                      currentPage:
 *                                          type: integer
 *                                          example: 1
 *                                      totalPages:
 *                                          type: integer
 *                                          example: 3
 *          401:
 *              description: Unauthorized
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders/{orderId}/track:
 *  get:
 *      summary: Track order status
 *      description: Get the current status of a specific order
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              description: Order ID
 *              example: "507f1f77bcf86cd799439011"
 *              required: true
 *      responses:
 *          200:
 *              description: Order status retrieved successfully
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
 *                                      status:
 *                                          type: string
 *                                          enum: ['Pending', 'Processing', 'Shipped', 'out for delivery', 'Delivered', 'cancelled']
 *                                          example: "Processing"
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Order not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders/{orderId}/cancel:
 *  put:
 *      summary: Cancel order
 *      description: Cancel a pending order (only for pending orders)
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              description: Order ID to cancel
 *              example: "507f1f77bcf86cd799439011"
 *              required: true
 *      responses:
 *          200:
 *              description: Order cancelled successfully
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
 *                                          example: "Order cancelled successfully"
 *          400:
 *              description: "Bad request - Order cannot be cancelled"
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Order not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders/{orderId}:
 *  get:
 *      summary: Get order by ID
 *      description: Get detailed information about a specific order
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              description: Order ID
 *              example: "507f1f77bcf86cd799439011"
 *              required: true
 *      responses:
 *          200:
 *              description: Order retrieved successfully
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
 *                                      order:
 *                                          $ref: '#/components/schemas/Order'
 *          401:
 *              description: Unauthorized
 *          404:
 *              description: Order not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders/{orderId}/status:
 *  put:
 *      summary: Update order status (Admin only)
 *      description: Update the status of an order (admin functionality)
 *      tags:
 *          -   Orders
 *      security:
 *          -   bearerAuth: []
 *      parameters:
 *          -   in: path
 *              name: orderId
 *              type: string
 *              description: Order ID to update
 *              example: "507f1f77bcf86cd799439011"
 *              required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   status
 *                      properties:
 *                          status:
 *                              type: string
 *                              enum: ['Pending', 'Processing', 'Shipped', 'out for delivery', 'Delivered', 'cancelled']
 *                              description: New order status
 *                              example: "Processing"
 *      responses:
 *          200:
 *              description: Order status updated successfully
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
 *                                          example: "Order status updated successfully"
 *                                      order:
 *                                          $ref: '#/components/schemas/Order'
 *          400:
 *              description: Bad request
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: "Forbidden - Admin access required"
 *          404:
 *              description: Order not found
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /orders:
 *  post:
 *      summary: Create order (Deprecated)
 *      description: Orders are now created through the payment module. This endpoint is deprecated.
 *      tags:
 *          -   Orders
 *      deprecated: true
 *      responses:
 *          410:
 *              description: "Gone - This endpoint is deprecated. Use POST /payment instead."
 */









