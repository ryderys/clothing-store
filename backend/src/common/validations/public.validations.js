const joi = require("joi")
const httpError = require("http-errors")
const MongoIDPattern =  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i

const ObjectIdValidator = joi.object({
    id: joi.string().pattern(MongoIDPattern).error(httpError.BadRequest("شناسه وارد شده صحیح نمیباشد"))
})
module.exports = ObjectIdValidator