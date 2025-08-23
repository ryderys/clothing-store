const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { UserModel } = require("./user.model");
const CartModel = require("../cart/cart.model");
const { logger } = require("../../common/utils/logger");
const { updateUserValidationSchema } = require("../../common/validations/user.validation");
const { UserMessages } = require("./user.messages");

class UserController{
    constructor(){
        autoBind(this)
    }
    async getUserProfile(req, res, next){
        try {
            const userId = req.user._id;

            const user = await UserModel.findById(userId)
            .select("-verifiedMobile -otp -products -__v -refreshToken")
            .lean()
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    user
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    
    async updateUserProfile(req, res, next){
        try {
            const userId = req.user._id;
            await updateUserValidationSchema.validateAsync(req.body)
            const data = {...req.body};
            const allowedFields = ["fullName", "username", "email", "address"]
            const dataToUpdate = Object.keys(data)
            .filter(field => allowedFields.includes(field))
            .reduce((obj, field) => {
                obj[field] = data[field]
                return obj
            }, {})

            if(Object.keys(dataToUpdate).length === 0){
                throw new httpError.BadRequest(UserMessages.UpdateFailed)
            }

           const result = await UserModel.findByIdAndUpdate(userId, {$set: dataToUpdate}, {new: true})
           if(!result) {
                throw new httpError.InternalServerError(UserMessages.UpdateFailed)
           }

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: UserMessages.ProfileUpdated,
                    user: result
                }
        })

        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getAllUsers(req, res, next){
        try {
            const {search} = req.query
            const databaseQuery = {}
            if(search) databaseQuery['$text'] = {$search: search}
            const users = await UserModel.find(databaseQuery)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    users
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = new UserController()