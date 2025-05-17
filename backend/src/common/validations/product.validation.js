const joi = require("joi");
const httpError = require("http-errors");
const { ValidationMessages } = require("./validation.messages");
 const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const createProductSchema = joi.object({
    title: joi.string().min(3).max(30).error(httpError.BadRequest(ValidationMessages.InvalidTitle)),
    description: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidDescription)),
    summary: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidSummary)),
    tags: joi.array().min(0).max(10).error(httpError.BadRequest(ValidationMessages.InvalidTag)),
    category: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidCategoryId)),
    price: joi.number().error(httpError.BadRequest(ValidationMessages.InvalidPrice)),
    count: joi.number().error(httpError.BadRequest(ValidationMessages.InvalidQuantity)),
    features: joi.object().pattern(
        joi.string(),
        joi.alternatives().try(
            joi.string(),
            joi.number(),
            joi.boolean(),
            joi.array().items(joi.string())
        )).error(httpError.BadRequest(ValidationMessages.InvalidType)),
    filename: joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/).error(httpError.BadRequest(ValidationMessages.InvalidFilename)),
    fileUploadPath: joi.allow()
})
const updateProductSchema = joi.object({
    title: joi.string().min(3).max(30).optional().error(httpError.BadRequest(ValidationMessages.InvalidTitle)),
    description: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidDescription)),
    summary: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidSummary)),
    tags: joi.array().min(0).max(10).optional().error(httpError.BadRequest(ValidationMessages.InvalidTag)),
    category: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidCategoryId)),
    price: joi.number().optional().error(httpError.BadRequest(ValidationMessages.InvalidPrice)),
    count: joi.number().optional().error(httpError.BadRequest(ValidationMessages.InvalidQuantity)),
    features: joi.object().pattern(
        joi.string(),
        joi.alternatives().try(
            joi.string(),
            joi.number(),
            joi.boolean(),
            joi.array().items(joi.string())
        )).optional().error(httpError.BadRequest(ValidationMessages.InvalidType)),
    filename: joi.string().regex(/(\.png|\.jpg|\.webp|\.jpeg)$/).optional().error(httpError.BadRequest(ValidationMessages.InvalidFilename)),
    fileUploadPath: joi.allow().optional(),
    // images: joi.array().items(joi.string()).optional()
})

module.exports = {
    createProductSchema,
    updateProductSchema
}