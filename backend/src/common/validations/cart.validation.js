const joi = require("joi")
const httpError = require("http-errors")
const { ValidationMessages } = require("./validation.messages")

const AddToCartSchema = joi.object({
    productId: joi.string().required().error(httpError.BadRequest(ValidationMessages.InvalidProductId)),
    quantity: joi.number().integer().min(1).required().error(httpError.BadRequest(ValidationMessages.InvalidQuantity))
})
const UpdateItemQuantitySchema = joi.object({
    productId: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidProductId)),
    quantity: joi.number().integer().min(1).error(httpError.BadRequest(ValidationMessages.InvalidQuantity))
})

const RemoveFromCartSchema = joi.object({
    productId: joi.string().required().error(httpError.BadRequest(ValidationMessages.InvalidProductId)),
})

module.exports = {
    AddToCartSchema,
    RemoveFromCartSchema,
    UpdateItemQuantitySchema
}