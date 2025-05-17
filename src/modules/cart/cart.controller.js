const autoBind = require("auto-bind");
const ObjectIdValidator = require("../../common/validations/public.validations");
const { ProductModel } = require("../product/product.model");
const httpError = require("http-errors");
const CartModel = require("./cart.model");
const { StatusCodes } = require("http-status-codes");
const { AddToCartSchema, RemoveFromCartSchema, UpdateItemQuantitySchema } = require("../../common/validations/cart.validation");
const { CartMessages } = require("./cart.messages");
const { logger } = require("../../common/utils/logger");

class CartController{
    constructor(){
        autoBind(this)
    }

    async getOrCreateCart(userId){
        let cart = await CartModel.findOne({userId})
        if(!cart){
            cart = new CartModel({userId, items : []})
            await cart.save()
        }
        return cart
    }

    async addItemToCart(req, res, next){
        try {
            await AddToCartSchema.validateAsync(req.body)
            const {productId, quantity} = req.body;
            const userId = req.user._id;

            const product = await this.findProductById(productId)
            if(product.count < quantity){
                throw new httpError.BadRequest(CartMessages.InsufficientStock)
            }


            let cart = await this.getOrCreateCart(userId)
            const existingItem = cart.items.find(item => item.productId.equals(productId))
                if(existingItem){
                    existingItem.quantity += +quantity; 
                }else {
                    cart.items.push({productId, quantity})
                }
                await cart.save()

            await this.validateCart(cart)
            await this.expireCart(cart, Date.now() + 30 * 60 * 1000)

            return this.sendCartResponse(res, cart, CartMessages.AddedToCartSuccess)

        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async removeItemFromCart(req, res, next){
        try {
            await RemoveFromCartSchema.validateAsync(req.params)
            const {productId} = req.params;
            const userId = req.user._id;

            let cart = await CartModel.findOne({userId})
            if(!cart){
                throw new httpError.NotFound(CartMessages.CartNotFound)
            }

            const initialItemCount = cart.items.length;
            cart.items = cart.items.filter(item => item.productId.toString() !== productId) 
            if(cart.items.length === initialItemCount){
                throw new httpError.BadRequest(CartMessages.ItemNotInCart)
            }
            await cart.save()
            
            return this.sendCartResponse(res, cart, CartMessages.ItemRemoveSuccess)
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async updateItemQuantity(req, res, next){
        try {
            await UpdateItemQuantitySchema.validateAsync(req.body)
            const {productId, quantity} = req.body
            const userId = req.user._id;

            if(quantity <= 0){
                throw new httpError.BadRequest(CartMessages.InvalidQuantity)
            }

            const cart = await CartModel.findOne({userId});
            if(!cart){
                throw new httpError.NotFound(CartMessages.CartNotFound)
            }

            const product = await this.findProductById(productId)
            if(!product){
                throw new httpError.NotFound(CartMessages.ProductNotFound)
            }

            const existingItem = cart.items.find(item => item.productId.equals(productId))
            if(existingItem){
                existingItem.quantity = +quantity
            } else {
                throw new httpError.NotFound(CartMessages.ItemNotInCart)
            }

            await cart.save()
            await this.validateCart(cart)
            await this.expireCart(cart, Date.now() + 30 * 60 * 1000)
            

            return this.sendCartResponse(res, cart)


        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getCart(req, res, next){
       try {
        const userId = req.user._id;
        const cart = await CartModel.findOne({userId}).populate('items.productId')

        if(!cart){
           throw new httpError.NotFound(CartMessages.CartNotFound)
        }
        await this.validateCart(cart)

        return this.sendCartResponse(res, cart)
       } catch (error) {
        logger.error(error)
            next(error)
       }
    }

    async clearCart(req, res, next){
        try {
            const userId = req.user._id;
            const cart = await CartModel.findOne({userId})
            if(!cart){
                throw new httpError.NotFound(CartMessages.CartNotFound)
            }
            cart.items =  [];

            await cart.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: CartMessages.ClearCartSuccess
                }

            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    

    async findProductById(productId){
        const {id} = await ObjectIdValidator.validateAsync({id: productId})
        const product = await ProductModel.findById(id)
        if(!product) throw new httpError.NotFound(CartMessages.ProductNotFound)
        return product
    }

    async validateCart(cart) {
        const invalidItems = [];
        for (const item of cart.items) {
          const product = await ProductModel.findById(item.productId);
          if (!product || product.count < item.quantity) {
            invalidItems.push(item);
          }
        }
        if (invalidItems.length > 0) {
          cart.items = cart.items.filter(item => !invalidItems.includes(item));
          await cart.save();
        }
        return cart;
      }

    async expireCart(cart, expiresAt) {
    cart.expiresAt = expiresAt;
    await cart.save();
    }

    sendCartResponse(res, cart, message = null) {
        const cartResponse = {
            _id: cart._id,
            userId: cart.userId,
            items: cart.items.map(item => ({
                id: item._id,
                productId: item.productId,
                quantity: item.quantity,
                productName: item.productId.name,
                productPrice: item.productId.price,
            })),
            expiresAt: cart.expiresAt,
        };

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                cart: cartResponse,
                message
            }
        })
    }
}

module.exports = new CartController()