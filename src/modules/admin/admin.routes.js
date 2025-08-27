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

// Add this route for data cleanup
router.post("/cleanup-corrupted-products", checkPermission(["admin"]), async (req, res, next) => {
    try {
        const cartProcessingService = require("../../common/services/cartProcessing.service");
        const result = await cartProcessingService.cleanupCorruptedProducts();
        
        res.status(200).json({
            statusCode: 200,
            data: {
                message: "Data cleanup completed",
                result
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = {
    AdminPanelRouter: router
}