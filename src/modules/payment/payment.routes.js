const Authorization = require("../../common/guard/authorization.guard")
const { requireCompleteProfile } = require("../../common/utils/profileValidation")
const paymentController = require("./payment.controller")

const router = require("express").Router()

// Payment requires complete profile
router.post("/", Authorization, requireCompleteProfile, paymentController.handleCartPayment)
router.get("/callback", paymentController.paymentVerifyHandler)

module.exports = {
    PaymentRouter: router
}