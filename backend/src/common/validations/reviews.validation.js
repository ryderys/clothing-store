const Joi = require("joi");
const httpError = require("http-errors");
const { ValidationMessages } = require("./validation.messages");

const ReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required().error(httpError.BadRequest(ValidationMessages.InvalidRating)),
    comment: Joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidDescription)),
})
const UpdateReviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).optional().error(httpError.BadRequest(ValidationMessages.InvalidRating)),
    comment: Joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidDescription)),
})

module.exports = {
    ReviewSchema,
    UpdateReviewSchema
}

