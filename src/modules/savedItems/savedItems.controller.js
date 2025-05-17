const autoBind = require("auto-bind");
const { StatusCodes } = require("http-status-codes");
const httpError = require("http-errors");
const CartModel = require("../cart/cart.model");
const { savedItemsModel } = require("./savedItem.model");
const { ProductModel } = require("../product/product.model");
const { SavedItemMessages } = require("./savedItems.messages");
const { logger } = require("../../common/utils/logger");
const { default: mongoose, mongo } = require("mongoose");

class SavedItemsController{
    constructor(){
        autoBind(this)
    }

    async saveItemForLater(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            if (!userId) {
                throw new httpError.Unauthorized(SavedItemMessages.UserNotAuthorized)
            }

            // Find or create the saved items list for the user
            let savedItems = await savedItemsModel.findOne({userId})
            if (!savedItems){
                savedItems = new savedItemsModel({userId, items: []})
            }

            // Add the item to the saved items list
            const existingSavedItem = savedItems.items.find(item => item.productId.equals(productId))
            if(existingSavedItem) throw new httpError.BadRequest(SavedItemMessages.ItemAlreadySaved)
            savedItems.items.push({productId})

            await savedItems.save() // Save the updated saved items list
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    savedItems
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async removeSavedItem(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            const savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                throw new httpError.NotFound(SavedItemMessages.ItemNotInSaved)
            }

            const itemIndex = savedItems.items.findIndex(item => item.productId.equals(productId))
            if(itemIndex === -1){
                throw new httpError.NotFound(SavedItemMessages.ItemNotFound)
            }

            savedItems.items.splice(itemIndex, 1)
            await savedItems.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: SavedItemMessages.ItemRemoved,
                    savedItems
                }
            })


        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async clearSavedItems(req, res, next) {
        try {
            const userId = req.user._id;
    
            let savedItems = await savedItemsModel.findOne({ userId });
            if (!savedItems) {
                throw new httpError.NotFound(SavedItemMessages.ItemNotInSaved);
            }
    
            savedItems.items = [];
            await savedItems.save();
    
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: SavedItemMessages.ItemsCleared
                }
            });
        } catch (error) {
            logger.error(error)
            next(error);
        }
    }

    async isItemSaved(req, res, next) {
        try {
            const { productId } = req.body;
            const userId = req.user._id;
    
            const savedItems = await savedItemsModel.findOne({ userId });
            if (!savedItems) {
                return res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK,
                    data: {
                        isSaved: false
                    }
                });
            }
    
            const itemIndex = savedItems.items.findIndex(item => item.productId.equals(productId));
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    isSaved: itemIndex !== -1
                }
            });
        } catch (error) {
            logger.error(error)
            next(error);
        }
    }
    

    async addSavedItemToCart(req, res, next){
        try {
            const {productId} = req.body;
            const userId = req.user._id;

            const product = await ProductModel.findById(productId)
            if(!product){
                throw new httpError.NotFound(SavedItemMessages.ProductNotFound)
            }

            let savedItems = await savedItemsModel.findOne({userId})
            if(!savedItems){
                throw new httpError.NotFound(SavedItemMessages.ItemNotInSaved)
            }

            const itemIndex = savedItems.items.findIndex(item => item.productId.equals(productId))
            if (itemIndex === -1){
                throw new httpError.NotFound(SavedItemMessages.ItemNotInSaved)
            }

            let cart = await CartModel.findOne({userId})
            if(!cart){
                cart = new CartModel({userId, items: []})
            }

            const existingItem = cart.items.find(cartItem => cartItem.productId.equals(productId));
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1 });
            } 

            savedItems.items.splice(itemIndex, 1)
            await savedItems.save()
            await cart.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data : {
                    cart,
                    savedItems
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    async viewSavedItems(req, res, next){
        try {
            const userId = req.user._id
            const savedItems = await savedItemsModel.findOne({userId}).populate('items.productId')
            if(!savedItems){
                throw new httpError.NotFound(SavedItemMessages.ItemNotInSaved)
            }
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    savedItems
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
}

module.exports = new SavedItemsController()