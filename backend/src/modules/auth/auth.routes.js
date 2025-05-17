const {Router} = require("express");
const {UserAuthController} = require("./auth.controller");
const Authorization = require("../../common/guard/authorization.guard");
const router = Router();

router.post("/get-otp", UserAuthController.getOTP)
router.post("/check-otp", UserAuthController.checkOTP)
router.post("/refresh-token", UserAuthController.refreshToken)
router.post("/logout",Authorization, UserAuthController.logout)

module.exports = {
    AuthRouter: router
}