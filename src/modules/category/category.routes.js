const adminAuthMiddleware = require("../../common/guard/auth.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const adminRateLimiter = require("../../common/middleware/rate-limit")
const { uploadFile } = require("../../common/utils/multer")
const categoryController = require("./category.controller")

const router = require("express").Router()

router.post("/",  adminAuthMiddleware, checkPermission('category', 'create'), uploadFile.single("photo"), categoryController.createCategory)
router.get("/", categoryController.getAllCategory) //adminAuthMiddleware, checkPermission('category', 'read')
router.delete("/:id", adminAuthMiddleware, checkPermission('category', 'delete') ,categoryController.deleteCategoryById)

module.exports = {
    AdminApiCategoryRouter: router
}