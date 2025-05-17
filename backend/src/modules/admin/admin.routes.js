const adminAuthMiddleware = require("../../common/guard/auth.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const adminRateLimiter = require("../../common/middleware/rate-limit")
const adminController = require("./admin.controller")

const router = require("express").Router()

// router.put('/assign-admin', adminAuthMiddleware, checkPermission('users', 'update'), adminRateLimiter , adminController.assignAdminRole)

// router.get("/role/list",adminAuthMiddleware, adminController.getAllRoles)
// router.post("/role/add", adminAuthMiddleware, adminController.addRole)
// router.delete("/role/remove/:filed", adminAuthMiddleware, adminController.removeRole)
// router.patch("/role/update/:id",adminAuthMiddleware, adminController.updateRoleById)

// router.get("/permission/list",adminAuthMiddleware, adminController.getAllPermissions)
// router.post("/permission/add",adminAuthMiddleware, adminController.addPermission)
// router.delete("/permission/remove/:id",adminAuthMiddleware, adminController.removePermission)
// router.patch("/permission/update/:id",adminAuthMiddleware, adminController.updatePermissionById)

module.exports = {
    AdminPanelRouter: router
}