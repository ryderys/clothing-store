const autoBind = require("auto-bind");
const httpError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const ReviewModel = require("./review.model");
const { ReviewSchema, UpdateReviewSchema } = require("../../common/validations/reviews.validation");
const { logger } = require("../../common/utils/logger");
const { ProductModel } = require("../product/product.model");
const { default: mongoose } = require("mongoose");
const { ReviewsMessages } = require("./reviews.messages");

class ReviewController{
    constructor() {
        autoBind(this)
    }

    async updateProductReviewSummary(productId){
        const reviews = await ReviewModel.find({productId})
        const reviewCount = reviews.length;
        const averageRating= reviews.reduce((sum, review) => sum + review.rating, 0) / (reviewCount || 1)

        await ProductModel.findByIdAndUpdate(productId, {
            averageRating: averageRating || 0,
            reviewCount    
        })
    }

    async createReview(req, res, next){
        try {
            await ReviewSchema.validateAsync(req.body)
            const userId = req.user._id;
            const {productId} = req.params;
            const { rating, comment} = req.body

            const product = await ProductModel.findById(productId)
            if(!product){
                throw new httpError.NotFound(ReviewsMessages.productNotFound)
            }

            const review = new ReviewModel({
                userId,
                productId,
                rating, 
                comment
            })

            await review.save()
            await this.updateProductReviewSummary(productId)

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    review
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    async getProductReviews(req, res, next){
        try {
            const {productId} = req.params;
            const {page = 1, limit = 10} = req.query;
            const reviews = await ReviewModel.find({productId}).populate('userId', 'name').skip((page - 1) * limit).limit(+limit)
            // .select('rating comment userId created updatedAt')
            const totalReviews = await ReviewModel.countDocuments({productId})

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    reviews,
                    totalReviews,
                    totalPages: Math.ceil(totalReviews / limit),
                    currentPage: page
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async updateReview(req, res, next){
        try {

            const userId = req.user._id;
            const {reviewId} = req.params;
            await UpdateReviewSchema.validateAsync(req.body)
            const {rating, comment} = req.body;
            
            const review = await ReviewModel.findOneAndUpdate(
                {_id: reviewId, userId},
                {rating, comment},
                {new : true}
            )
            if(!review){
                throw new httpError.NotFound(ReviewsMessages.ReviewNotFound)
            }

            await this.updateProductReviewSummary(review.productId)


            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    review
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async deleteReview(req, res, next){
        try {
            const userId = req.user._id;
            const {reviewId} = req.params;

            const review = await ReviewModel.findOneAndDelete({_id: reviewId, userId})
            if(!review){
                throw new httpError.NotFound(ReviewsMessages.ReviewNotFound)
            }
            await this.updateProductReviewSummary(review.productId)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: ReviewsMessages.ReviewDeleted
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getAverageRating(req, res, next){
        try {
            const {productId} = req.params;
            const reviews = await ReviewModel.aggregate([
                { $match: {productId: new mongooseTypes.ObjectId(productId)}},
                {
                    $group: {
                        _id: null,
                        averageRating: {$avg: "$rating"}
                    }
                }
            ])
            const averageRating = reviews.length > 0 ? reviews[0].averageRating : 0

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    averageRating
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = new ReviewController()