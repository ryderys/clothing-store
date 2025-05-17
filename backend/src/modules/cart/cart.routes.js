const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission, checkOwnership } = require("../../common/middleware/checkPermission")
const cartController = require("./cart.controller")
const CartModel = require("./cart.model")

const router = require("express").Router()

router.post("/add", Authorization, checkPermission('cart', 'create'), cartController.addItemToCart),
router.get("/",Authorization, checkOwnership(CartModel, 'cart', 'readOwn'), cartController.getCart),
router.put("/update",Authorization,  checkOwnership(CartModel, 'cart', 'updateOwn'), cartController.updateItemQuantity)
router.get("/clear-cart",Authorization,  checkOwnership(CartModel, 'cart', 'updateOwn'), cartController.clearCart)
router.delete("/remove/:productId",Authorization,  checkOwnership(CartModel, 'cart', 'updateOwn'), cartController.removeItemFromCart)

module.exports = {
    CartRouter : router
}