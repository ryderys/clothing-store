const autoBind = require("auto-bind");
const CartModel = require("../cart/cart.model");
const httpError = require("http-errors");
const OrderModel = require("./orders.model");
const { StatusCodes } = require("http-status-codes");
const { logger } = require("../../common/utils/logger");
const { UserModel } = require("../user/user.model");
const { OrderMessages } = require("./order.messages");

class OrderController{
    constructor() {
        autoBind(this)
    }

    // Create order from cart items (called by payment module)
    async createOrderFromCart(userId, validItems, totalAmount) {
        try {
            // Get user delivery address using centralized service
            const cartProcessingService = require("../../common/services/cartProcessing.service");
            const deliveryAddress = await cartProcessingService.getUserDeliveryAddress(userId);

            const order = new OrderModel({
                userId,
                items: validItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity, 
                    price: item.price
                })),
                totalAmount,
                status: 'Pending',
                deliveryAddress
            });

            await order.save();
            logger.info(`Order created for user ${userId} with order ID ${order._id}`);
            return order;
        } catch (error) {
            logger.error(`Error creating order: ${error.message}`);
            throw error;
        }
    }

    // Get order by ID
    async getOrderById(req, res, next){
        try {
            const {orderId} = req.params;
            const order = await OrderModel.findById(orderId).populate('items.productId')
            if(!order){
                throw new httpError.NotFound(OrderMessages.OrderNotFound)
            }

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    order
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    // Get user's orders
    async getUserOrders(req, res, next){
        try {
            const userId = req.user._id;
            const order = await OrderModel.find({userId}).populate('items.productId')
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    order
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    // Get user's order history with pagination
    async getUserOrderHistory(req, res, next){
        try {
            const userId = req.user._id;
            const {page = 1, limit= 10} = req.query
            const orders = await OrderModel.find({userId}).populate('items.productId').skip((page - 1) * limit).limit(+limit)
            const totalOrders = await OrderModel.countDocuments({userId})

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    orders,
                    totalOrders,
                    currentPage: page,
                    totalPages: Math.ceil(totalOrders / limit)
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    // Track order status
    async trackOrder(req, res, next){
        try {
            const {orderId} = req.params
            const order = await OrderModel.findById(orderId).populate('items.productId')
            if(!order) {
                throw new httpError.NotFound(OrderMessages.OrderNotFound)
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    status: order.status
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    // Cancel order
    async cancelOrder(req, res, next){
        try {
            const {orderId} = req.params
            const userId = req.user._id;

            const order = await OrderModel.findOne({_id: orderId, userId})
            if(!order || order.status !== 'Pending'){
                throw new httpError.BadRequest(OrderMessages.OrderCancelFailed)
            }

            order.status = 'cancelled'
            await order.save()
            logger.info(`Order ${orderId} cancelled by user ${userId}`);
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: OrderMessages.OrderCanceled
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    // Update order status (for admin use)
    async updateOrderStatus(req, res, next){
        try {
            const {orderId} = req.params
            const {status} = req.body;
            
            const order = await OrderModel.findById(orderId)
            if(!order) {
                throw new httpError.NotFound("Order not found")
            }
            
            order.status = status
            order.updatedAt = Date.now()
            await order.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: 'Order status updated successfully',
                    order
                }
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new OrderController()