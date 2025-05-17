const httpError = require("http-errors");
const Joi = require("joi");

MongoIDPattern = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

const addRoleSchema = Joi.object({
    title: Joi.string().min(3).max(30).error(httpError.BadRequest("عنوان نقش صحیح نمیباشد")),
    description: Joi.string().min(0).max(100).error(httpError.BadRequest(" توضیحات صحیح نمیباشد")),
    permission: Joi.array().items(Joi.string().pattern(MongoIDPattern)).error(httpError.BadRequest("دسترسی های ارسال شده صحیح نمیباشد")),
})

const addPermissionSchema = Joi.object({
    name: Joi.string().min(3).max(30).error(httpError.BadRequest("عنوان نقش صحیح نمیباشد")),
    description: Joi.string().min(0).max(100).error(httpError.BadRequest(" توضیحات صحیح نمیباشد")),
})

module.exports = {
    addPermissionSchema,
    addRoleSchema
}