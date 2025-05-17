const joi = require("joi")
const httpError = require("http-errors")
const { ValidationMessages } = require("./validation.messages")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
const createCategorySchema = joi.object({
    title: joi.string().min(3).max(30).error(httpError.BadRequest(ValidationMessages.TitleRequired)),
    slug: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidSlug)),
    icon: joi.string().error(httpError.BadRequest(ValidationMessages.InvalidIcon)),
    parent: joi.string().optional().pattern(MongoIDPattern).error(httpError.BadRequest(ValidationMessages.InvalidId)),
    parents: joi.string().optional().pattern(MongoIDPattern).error(httpError.BadRequest(ValidationMessages.InvalidId))

})

module.exports = {
    createCategorySchema
}
