/**
 * @swagger
 * tags:
 *  name: Payment
 *  description: Payment module and Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          Payment:
 *              type: object
 *              required:
 *                  -   amount
 *                  -   userId
 *                  -   orderId
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: Payment ID
 *                      example: "507f1f77bcf86cd799439011"
 *                  amount:
 *                      type: number
 *                      description: Payment amount
 *                      example: 325000
 *                  userId:
 *                      type: string
 *                      description: User ID who made the payment
 *                      example: "507f1f77bcf86cd799439012"
 *                  orderId:
 *                      type: string
 *                      description: Order ID associated with the payment
 *                      example: "507f1f77bcf86cd799439013"
 *                  status:
 *                      type: boolean
 *                      description: "Payment status (false = pending, true = completed)"
 *                      example: false
 *                  refId:
 *                      type: string
 *                      description: "Payment reference ID from payment gateway"
 *                      example: "12345"
 *                  authority:
 *                      type: string
 *                      description: "Payment authority from Zarinpal"
 *                      example: "A000000000000000000000000000000000000000"
 *                  createdAt:
 *                      type: string
 *                      format: date-time
 *                      description: "Payment creation date"
 *                  updatedAt:
 *                      type: string
 *                      format: date-time
 *                      description: "Payment last update date"
 *          
 *          PaymentInitiation:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: integer
 *                      example: 200
 *                  data:
 *                      type: object
 *                      properties:
 *                          payment_url:
 *                              type: string
 *                              description: "URL to redirect user for payment"
 *                              example: "https://sandbox.zarinpal.com/pg/StartPay/A000000000000000000000000000000000000000"
 *                          authority:
 *                              type: string
 *                              description: "Payment authority for verification"
 *                              example: "A000000000000000000000000000000000000000"
 *                          orderId:
 *                              type: string
 *                              description: "Order ID created for this payment"
 *                              example: "507f1f77bcf86cd799439013"
 *                          cartId:
 *                              type: string
 *                              description: "Cart ID that was processed for payment"
 *                              example: "507f1f77bcf86cd799439011"
 */

/**
 * @swagger
 * /payment:
 *  post:
 *      summary: Initiate payment for cart items
 *      description: "Create an order from cart items and initiate payment with Zarinpal"
 *      tags:
 *          -   Payment
 *      security:
 *          -   bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   cartId
 *                      properties:
 *                          cartId:
 *                              type: string
 *                              description: "ID of the cart to process for payment"
 *                              example: "507f1f77bcf86cd799439011"
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          -   cartId
 *                      properties:
 *                          cartId:
 *                              type: string
 *                              description: "ID of the cart to process for payment"
 *                              example: "507f1f77bcf86cd799439011"
 *      responses:
 *          200:
 *              description: Payment initiated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/PaymentInitiation'
 *          400:
 *              description: "Bad request - Cart empty or profile incomplete"
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/ProfileValidationError'
 *          401:
 *              description: "Unauthorized - Authentication required"
 *          404:
 *              description: "Cart not found or access denied"
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 * /payment/callback:
 *  get:
 *      summary: Payment verification callback
 *      description: "Handle payment verification from Zarinpal payment gateway"
 *      tags:
 *          -   Payment
 *      parameters:
 *          -   in: query
 *              name: Authority
 *              type: string
 *              description: "Payment authority from Zarinpal"
 *              example: "A000000000000000000000000000000000000000"
 *              required: true
 *          -   in: query
 *              name: Status
 *              type: string
 *              description: "Payment status from Zarinpal"
 *              example: "OK"
 *              required: true
 *      responses:
 *          302:
 *              description: "Redirect to frontend with payment result"
 *              headers:
 *                  Location:
 *                      description: Redirect URL
 *                      schema:
 *                          type: string
 *                          example: "https://frontend.com/payment?status=success"
 *          400:
 *              description: "Bad request - Invalid payment parameters"
 *          500:
 *              description: Internal server error
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          ProfileValidationError:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: integer
 *                      example: 400
 *                  data:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "لطفااطلاعات حساب کاربری خود را تکمیل کنید"
 *                      redirectTo:
 *                          type: string
 *                          example: "/profile"
 *                      missingFields:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["fullName", "email", "address.street", "address.city"]
 *                      missingBasicFields:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["fullName", "email"]
 *                      missingAddressFields:
 *                          type: array
 *                          items:
 *                              type: string
 *                          example: ["street", "city"]
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CartValidationError:
 *              type: object
 *              properties:
 *                  statusCode:
 *                      type: integer
 *                      example: 400
 *                  data:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: "Cart is empty"
 */
