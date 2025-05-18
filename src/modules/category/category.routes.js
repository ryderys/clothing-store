const adminAuthMiddleware = require("../../common/guard/auth.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const adminRateLimiter = require("../../common/middleware/rate-limit")
const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/",  adminAuthMiddleware, checkPermission('category', 'create'), categoryController.createCategory)
router.get("/", categoryController.getAllCategory) //adminAuthMiddleware, checkPermission('category', 'read')
router.delete("/:id", adminAuthMiddleware, checkPermission('category', 'delete') ,categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}