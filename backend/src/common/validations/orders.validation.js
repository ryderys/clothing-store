const joi = require("joi")
const httpError = require("http-errors");
const { ValidationMessages } = require("./validation.messages");

const OrderSchema = joi.object({
    productId: joi.string().required().error(httpError.BadRequest(ValidationMessages.InvalidProductId)),
    quantity: joi.number().integer().min(1).required().error(httpError.BadRequest(ValidationMessages.InvalidQuantity))
})



module.exports = {
    OrderSchema
}