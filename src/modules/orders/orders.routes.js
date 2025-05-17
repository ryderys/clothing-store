const Authorization = require("../../common/guard/authorization.guard")
const {checkPermission, checkOwnership} = require("../../common/middleware/checkPermission")
const ordersController = require("./orders.controller")
const OrderModel = require("./orders.model")

const router = require("express").Router()

// general permissions check first , then ownership check if needed
router.post('/', Authorization, checkPermission('order', 'create'), ordersController.createOrder)

router.get('/',  Authorization,  checkPermission('order', 'read'),checkOwnership(OrderModel, 'order', 'readOwn'),ordersController.getUserOrders)

router.get('/history', Authorization, checkPermission('order', 'read'), checkOwnership(OrderModel, 'order', 'readOwn') ,ordersController.getUserOrderHistory)

router.get('/:orderId/track',  Authorization, checkOwnership(OrderModel, 'order', 'updateOwn'),ordersController.trackOrder)

router.put('/:orderId/cancel',  Authorization,  checkOwnership(OrderModel, 'order', 'updateOwn'), ordersController.cancelOrder)

router.get('/:orderId',  Authorization, checkPermission('order', 'read'),  checkOwnership(OrderModel, 'order', 'readOwn'),ordersController.getOrderById)

// router.put('/:orderId/status', ordersController.updateOrderStatus)

module.exports = {
    OrderRouter: router
}