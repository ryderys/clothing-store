const joi = require("joi")
const httpError = require("http-errors")
const { ValidationMessages } = require("./validation.messages")

const getOtpSchema = joi.object({
    mobile: joi.string().length(11).pattern(/^09[0-9]{9}/).error(httpError.BadRequest(ValidationMessages.InvalidMobile))
})

const checkOtpSchema = joi.object({
    mobile: joi.string().length(11).pattern(/^09[0-9]{9}/).error(httpError.BadRequest(ValidationMessages.InvalidMobile)),
    code: joi.string().min(4).max(6).error(httpError.BadRequest(ValidationMessages.InvalidCode))
})

module.exports = {
    getOtpSchema,
    checkOtpSchema
}