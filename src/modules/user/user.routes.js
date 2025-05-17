const adminAuthMiddleware = require("../../common/guard/auth.guard")
const Authorization = require("../../common/guard/authorization.guard")
const checkPendingOrder = require("../../common/middleware/checkPendingOrder")
const { checkOwnership, checkPermission } = require("../../common/middleware/checkPermission")
const userController = require("./user.controller")
const { UserModel } = require("./user.model")

const router = require("express").Router()

router.get("/profile", Authorization, checkOwnership(UserModel, 'users', 'readOwn'), userController.getUserProfile)
router.get("/all", adminAuthMiddleware , checkPermission('users', 'read') , userController.getAllUsers)
router.patch("/update-profile", Authorization, checkOwnership(UserModel, 'users', 'updateOwn'),  userController.updateUserProfile, checkPendingOrder)

module.exports = {
    UserRouter : router
}