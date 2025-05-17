const Joi = require("joi");

const userValidationSchema = Joi.object({
    fullName: Joi.string().trim().optional(),
    username: Joi.string().lowercase().trim().optional(),
    email: Joi.string().email().lowercase().trim().optional(),
    mobile: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    refreshToken: Joi.string().optional(),
    verifiedMobile: Joi.boolean().default(false).optional(),
    otp: Joi.object({
        code: Joi.string().optional(),
        expiresIn: Joi.number().optional()
    }).optional(),
    cart: Joi.string().optional(),
    savedItems: Joi.string().optional(),
    products: Joi.array().items(Joi.string()).default([]),
    role: Joi.string().valid('admin', 'user', 'quest').default('user')
})

const updateUserValidationSchema = Joi.object({
    fullName: Joi.string().trim().optional(),
    username: Joi.string().lowercase().trim().optional(),
    email: Joi.string().email().lowercase().trim().optional(),

})

module.exports = {
    userValidationSchema,
    updateUserValidationSchema
}