const adminAuthMiddleware = require("../../common/guard/auth.guard")
const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission } = require("../../common/middleware/checkPermission")
const featuresController = require("./features.controller")

const router = require("express").Router()

router.post("/", adminAuthMiddleware, checkPermission('features', 'create') ,featuresController.addFeature )
router.get("/",adminAuthMiddleware, checkPermission('features', 'read'), featuresController.findAllFeatures )
router.get("/by-category/:categoryId", adminAuthMiddleware, checkPermission('features', 'read'),  featuresController.findFeatureByCategoryId )
router.get("/by-category-slug/:slug", adminAuthMiddleware, checkPermission('features', 'read'), featuresController.findByCategorySlug )
router.delete("/:id", adminAuthMiddleware, checkPermission('features', 'delete'), featuresController.removeFeatureById )
router.put("/:id", adminAuthMiddleware, checkPermission('features', 'update'), featuresController.updateFeature)

module.exports = {
    AdminApiFeatureRouter : router
}