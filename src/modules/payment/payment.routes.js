const Authorization = require("../../common/guard/authorization.guard")
const paymentController = require("./payment.controller")

const router = require("express").Router()

router.post("/", Authorization, paymentController.handleCartPayment)
router.get("/callback", paymentController.paymentVerifyHandler)

module.exports = {
    PaymentRouter: router
}