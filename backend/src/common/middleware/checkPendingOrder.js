const { StatusCodes } = require("http-status-codes");
const PendingOrderModel = require("../../modules/orders/pending-order.model");
const OrderModel = require("../../modules/orders/orders.model");
const { MiddlewaresMessages } = require("./middleware.messages");

async function checkPendingOrder(req, res, next){
    try {
        const userId = req.user._id;
        const pendingOrder = await PendingOrderModel.findOne({userId})
        if(pendingOrder){
            const order = new OrderModel({
                userId: pendingOrder.userId,
                items: pendingOrder.items,
                totalAmount: pendingOrder.totalAmount,
                status: "Pending"
            })
            await order.save()
            await PendingOrderModel.deleteOne({userId})
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: MiddlewaresMessages.OrderCreated,
                    order
                }
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = checkPendingOrder