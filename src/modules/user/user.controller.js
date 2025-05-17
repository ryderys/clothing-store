const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const { UserModel } = require("./user.model");
const CartModel = require("../cart/cart.model");
const OrderModel = require("../orders/orders.model");
const PendingOrderModel = require("../orders/pending-order.model");
const { logger } = require("../../common/utils/logger");
const { userValidationSchema, updateUserValidationSchema } = require("../../common/validations/user.validation");
const { UserMessages } = require("./user.messages");

class UserController{
    constructor(){
        autoBind(this)
    }
    async getUserProfile(req, res, next){
        try {
            const user = req.user;
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
            const allowedFields = ["fullname", "username", "email"]
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
            // await this.processPendingOrder(userId)

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

    async processPendingOrder(userId){
        const pendingOrder = await PendingOrderModel.findOne({userId})
            if(pendingOrder){
                const cart = await CartModel.findOne({userId}).populate('items.productId')
                if(!cart || cart.items.length === 0){
                    throw new httpError.BadRequest(UserMessages.CartIsEmpty)
                }
                const totalAmount = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0)
                const order = await PendingOrderModel.create({
                    userId: pendingOrder.userId,
                    items: cart.items.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity, 
                        price: item.productId.price
                    })),
                    totalAmount,
                    status: "pending"
                })
                await order.save()
                cart.items = []
                await cart.save()
                await PendingOrderModel.deleteOne({userId})
                logger.info(`Order created for user ${userId} with order ID ${order._id}`)

                return order
            }
        }


        
}

module.exports = new UserController()