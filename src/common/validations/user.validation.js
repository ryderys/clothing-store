const Joi = require("joi");

const addressSchema = Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    postalCode: Joi.string().trim().optional(),
    country: Joi.string().trim().optional()
});

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
    role: Joi.string().valid('admin', 'user', 'quest').default('user'),
    address: addressSchema.optional()
});

const updateUserValidationSchema = Joi.object({
    fullName: Joi.string().trim().optional(),
    username: Joi.string().lowercase().trim().optional(),
    email: Joi.string().email().lowercase().trim().optional(),
    address: addressSchema.optional()
});

module.exports = {
    userValidationSchema,
    updateUserValidationSchema
};