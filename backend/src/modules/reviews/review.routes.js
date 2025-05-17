const Authorization = require("../../common/guard/authorization.guard")
const {checkPermission, checkOwnership} = require("../../common/middleware/checkPermission")
const reviewController = require("./review.controller")
const ReviewModel = require("./review.model")

const router = require("express").Router()

router.post("/product/:productId", Authorization ,checkPermission('review', 'create'),reviewController.createReview)
router.get("/product/:productId", Authorization, checkPermission('review', 'read'), reviewController.getProductReviews)
router.put("/:reviewId", Authorization ,checkPermission('review', 'update'),checkOwnership(ReviewModel, 'review', 'updateOwn'), reviewController.updateReview)
router.delete("/:reviewId", Authorization ,checkPermission('review', 'delete'),checkOwnership(ReviewModel, 'review', 'deleteOwn'), reviewController.deleteReview)
router.get("/product/:productId/average-rating", Authorization, checkPermission('review', 'read'), reviewController.getAverageRating)

module.exports = {
    ReviewsRouter: router
}

