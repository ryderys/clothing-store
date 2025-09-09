const Authorization = require("../../common/guard/authorization.guard")
const {checkPermission, checkOwnership} = require("../../common/middleware/checkPermission")
const ordersController = require("./orders.controller")
const OrderModel = require("./orders.model")

const router = require("express").Router()

// Note: Orders are created through the payment module, not directly
// router.post('/', Authorization, checkPermission('order', 'create'), ordersController.createOrder)

router.get('/',  Authorization, checkOwnership(OrderModel, 'order', 'readOwn'),ordersController.getUserOrders)

router.get('/history', Authorization, checkOwnership(OrderModel, 'order', 'readOwn') ,ordersController.getUserOrderHistory)

router.get('/:orderId/track',  Authorization, checkOwnership(OrderModel, 'order', 'updateOwn', 'orderId'),ordersController.trackOrder)

router.put('/:orderId/cancel',  Authorization,  checkOwnership(OrderModel, 'order', 'updateOwn', 'orderId'), ordersController.cancelOrder)

router.get('/:orderId',  Authorization, checkOwnership(OrderModel, 'order', 'readOwn', 'orderId'),ordersController.getOrderById)

// Admin route to update order status
router.put('/:orderId/status', Authorization, checkPermission('order', 'update'), ordersController.updateOrderStatus)

// Admin route to delete all orders or specific user's orders
router.delete('/', Authorization, checkPermission('order', 'delete'), ordersController.deleteOrders)
router.delete('/user/:userId', Authorization, checkPermission('order', 'delete'), ordersController.deleteOrders)

module.exports = {
    OrderRouter: router
}