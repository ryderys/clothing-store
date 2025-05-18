const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { PaymentModel } = require("./payment.model");
const cartController = require("../cart/cart.controller");
const { logger } = require("../../common/utils/logger");
const OrderModel = require("../orders/orders.model");
const { UserModel } = require("../user/user.model");
const { zarinaplRequest, zarinpalVerify } = require("../zarinpal/zarinpal.controller");

class PaymentController {
    constructor() {
        autoBind(this);
    }

    async handleCartPayment(req, res, next) {
        try {
            const userId = req.user._id;
            
            // Validate user profile
            const user = await UserModel.findById(userId);
            if (!user.fullName || !user.email) {
                throw new httpError.BadRequest("Please complete your profile before making a payment");
            }

            // Get user's cart
            const cart = await cartController.getOrCreateCart(userId);
            
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new httpError.BadRequest("Cart is empty");
            }

            // Calculate total amount
            const totalAmount = cart.items.reduce((total, item) => {
                return total + (item.productId.price * item.quantity);
            }, 0);

            // Create order first
            const order = await OrderModel.create({
                userId,
                items: cart.items.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity,
                    price: item.productId.price
                })),
                totalAmount,
                status: 'Pending'
            });

            // Create payment record
            const payment = await PaymentModel.create({
                amount: totalAmount,
                userId,
                orderId: order._id,
                status: false
            });

            try {
                const result = await zarinaplRequest(payment.amount, user);
                if (!result?.authority) {
                    throw new httpError.BadRequest("Failed to initiate payment");
                }
                
                payment.authority = result.authority;
                await payment.save();

                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    data: {
                        payment_url: result.payment_url,
                        authority: result.authority
                    }
                });
            } catch (error) {
                // Clean up if payment initiation fails
                await PaymentModel.findByIdAndDelete(payment._id);
                await OrderModel.findByIdAndDelete(order._id);
                throw error;
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    }

    async paymentVerifyHandler(req, res, next) {
        try {
            const { Authority, status } = req.query;
            
            if (status !== "OK" || !Authority) {
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
                payment.refId = result.ref_id;
                await payment.save();

                // Update order
                const order = await OrderModel.findById(payment.orderId);
                if (!order) {
                    throw httpError.NotFound("Order not found");
                }
                order.status = "Processing";
                await order.save();

                // Clear cart
                await cartController.clearCart(req, res, next);

                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=success`);
            } catch (error) {
                // Clean up on verification failure
                await PaymentModel.findByIdAndDelete(payment._id);
                await OrderModel.findByIdAndDelete(payment.orderId);
                return res.redirect(`${process.env.FRONTEND_URL}/payment?status=failure&error=${error.message}`);
            }

        } catch (error) {
            logger.error(error);
            next(error);
        }
    }
}

module.exports = new PaymentController();