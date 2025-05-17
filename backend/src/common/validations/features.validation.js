const joi = require("joi")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const httpError = require("http-errors");
const { ValidationMessages } = require("./validation.messages");

const createFeatureSchema = joi.object({
    title: joi.string().required().error(httpError.BadRequest(ValidationMessages.InvalidTitle)),
    key: joi.string().required().error(httpError.BadRequest(ValidationMessages.InvalidKey)),
    type: joi.string().valid('number', 'string', 'array', 'boolean').required().error(httpError.BadRequest(ValidationMessages.InvalidType)),
    list: joi.alternatives().try(joi.array(), joi.string()).error(httpError.BadRequest(ValidationMessages.InvalidList)),
    guid: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidGuid)),
    category: joi.string().pattern(MongoIDPattern).required().error(httpError.BadRequest(ValidationMessages.InvalidCategoryId))
});

const updateFeatureSchema = joi.object({
    title: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidTitle)),
    key: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidKey)),
    type: joi.string().valid('number', 'string', 'array', 'boolean').optional().error(httpError.BadRequest(ValidationMessages.InvalidType)),
    list: joi.alternatives().try(joi.array(), joi.string()).optional().error(httpError.BadRequest(ValidationMessages.InvalidList)),
    guid: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidGuid)),
    category: joi.string().optional().error(httpError.BadRequest(ValidationMessages.InvalidCategoryId))
});

module.exports = {
    createFeatureSchema,
    updateFeatureSchema
}