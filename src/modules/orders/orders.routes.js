const Authorization = require("../../common/guard/authorization.guard")
const {checkPermission, checkOwnership} = require("../../common/middleware/checkPermission")
const ordersController = require("./orders.controller")
const OrderModel = require("./orders.model")

const router = require("express").Router()

// Note: Orders are created through the payment module, not directly
// router.post('/', Authorization, checkPermission('order', 'create'), ordersController.createOrder)

router.get('/',  Authorization,  checkPermission('order', 'read'),checkOwnership(OrderModel, 'order', 'readOwn'),ordersController.getUserOrders)

router.get('/history', Authorization, checkPermission('order', 'read'), checkOwnership(OrderModel, 'order', 'readOwn') ,ordersController.getUserOrderHistory)

router.get('/:orderId/track',  Authorization, checkOwnership(OrderModel, 'order', 'updateOwn'),ordersController.trackOrder)

router.put('/:orderId/cancel',  Authorization,  checkOwnership(OrderModel, 'order', 'updateOwn'), ordersController.cancelOrder)

router.get('/:orderId',  Authorization, checkPermission('order', 'read'),  checkOwnership(OrderModel, 'order', 'readOwn'),ordersController.getOrderById)

// Admin route to update order status
router.put('/:orderId/status', Authorization, checkPermission('order', 'update'), ordersController.updateOrderStatus)

module.exports = {
    OrderRouter: router
}