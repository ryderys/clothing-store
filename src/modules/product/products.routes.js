const adminAuthMiddleware = require("../../common/guard/auth.guard")
const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const { stringToArray } = require("../../common/utils/functions")
const { uploadFile } = require("../../common/utils/multer")
const { ProductController } = require("./product.controller")

const router = require("express").Router()

router.post("/add", adminAuthMiddleware, checkPermission('product', 'create'), uploadFile.array("images", 10) ,stringToArray("tags"), ProductController.addProduct)
router.get("/all",  ProductController.getAllProducts) //Authorization, checkPermission('product', 'read'),
router.get("/:id",Authorization, checkPermission('product', 'read'), ProductController.getOneProductById)
router.delete("/remove/:id",adminAuthMiddleware, checkPermission('product', 'delete'), ProductController.removeProductById)
router.patch("/edit/:id",adminAuthMiddleware, checkPermission('product', 'update'), uploadFile.array("images", 10), stringToArray("tags"), ProductController.editProductById)

module.exports = {
    AdminApiProductRouter : router
}