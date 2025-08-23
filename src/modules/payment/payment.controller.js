const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { PaymentModel } = require("./payment.model");
const { logger } = require("../../common/utils/logger");
const OrderModel = require("../orders/orders.model");
const { zarinaplRequest, zarinpalVerify } = require("../zarinpal/zarinpal.controller");
const orderController = require("../orders/orders.controller");
const cartProcessingService = require("../../common/services/cartProcessing.service");

class PaymentController {
    constructor() {
        autoBind(this);
    }

    async handleCartPayment(req, res, next) {
        try {
            const userId = req.user._id;
            const { cartId } = req.body;
            
            if (!cartId) {
                throw new httpError.BadRequest("Cart ID is required");
            }
            
            // Use centralized service to process cart
            const { cart, validItems, totalAmount, stockReserved } = await cartProcessingService.processCartForPayment(cartId, userId);

            // Create order using the order controller
            const order = await orderController.createOrderFromCart(userId, validItems, totalAmount);

            try {
                // Initiate Zarinpal payment first to get authority
                const result = await zarinaplRequest(totalAmount, req.user);
                if (!result?.authority) {
                    throw new httpError.BadRequest("Failed to initiate payment");
                }

                // Create payment record with authority
                const payment = await PaymentModel.create({
                    amount: totalAmount,
                    userId,
                    orderId: order._id,
                    cartId: cartId,
                    status: false,
                    authority: result.authority
                });

                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    data: {
                        payment_url: result.payment_url,
                        authority: result.authority,
                        orderId: order._id,
                        cartId: cartId
                    }
                });
            } catch (error) {
                // Clean up if payment initiation fails
                await OrderModel.findByIdAndDelete(order._id);
                
                // Restore product stock since order failed
                await cartProcessingService.restoreStock(stockReserved);
                
                throw error;
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

    async paymentVerifyHandler(req, res, next) {
        try {
            const { Authority, Status } = req?.query;
            
            if (Status !== "OK" || !Authority) {
                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=failure&error=invalid_status`);
            }

            const payment = await PaymentModel.findOne({ authority: Authority });
            if (!payment) {
                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=failure&error=payment_not_found`);
            }

            try {
                const result = await zarinpalVerify(payment.amount, Authority);
                if (!result) {
                    throw new httpError.BadRequest("Payment verification failed");
                }

                // Update payment
                payment.status = true;
                payment.refId = result.ref_id || "12345";
                
                // Update order
                const order = await OrderModel.findById(payment.orderId);
                if (!order) {
                    throw httpError.NotFound("Order not found");
                }
                order.status = "Processing";
                await payment.save();
                await order.save();

                // Clear the specific cart that was used for this payment
                // Only clear after successful order processing
                await cartProcessingService.clearCart(payment.cartId);

                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=success`);
            } catch (error) {
                // Clean up on verification failure
                // Get order data before deleting it for stock restoration
                const order = await OrderModel.findById(payment.orderId);
                
                await PaymentModel.findByIdAndDelete(payment._id);
                await OrderModel.findByIdAndDelete(payment.orderId);
                
                // Restore product stock since order failed
                if (order) {
                    // Convert order items back to stock restoration format
                    // We need to restore stock to what it was before the order
                    const stockReserved = order.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        originalStock: item.quantity // This will be added back to current stock
                    }));
                    await cartProcessingService.restoreStock(stockReserved);
                }
                
                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=failure`);
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}

module.exports = new PaymentController();