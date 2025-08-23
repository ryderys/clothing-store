const CartModel = require("../../modules/cart/cart.model");
const { ProductModel } = require("../../modules/product/product.model");
const { UserModel } = require("../../modules/user/user.model");
const httpError = require("http-errors");
const { logger } = require("../utils/logger");

class CartProcessingService {
    /**
     * Process cart for payment - validates, checks stock, and prepares for order creation
     */
    async processCartForPayment(cartId, userId) {
        try {
            // Get cart with populated product data
            const cart = await CartModel.findOne({ _id: cartId, userId }).populate('items.productId');
            
            if (!cart) {
                throw new httpError.NotFound("Cart not found or access denied");
            }
            
            // Check if cart is expired
            if (cart.expiresAt && new Date() > cart.expiresAt) {
                throw new httpError.BadRequest("Cart has expired. Please refresh your cart and try again.");
            }
            
            if (!cart.items || cart.items.length === 0) {
                throw new httpError.BadRequest("Cart is empty");
            }

            // Validate cart and get processed data
            const { validItems, totalAmount, stockReserved } = await this.validateAndProcessCart(cart);
            
            if (validItems.length === 0) {
                throw new httpError.BadRequest("No valid items found in cart. Please refresh your cart.");
            }

            return {
                cart,
                validItems,
                totalAmount,
                stockReserved
            };
        } catch (error) {
            logger.error(`Error processing cart for payment: ${error.message}`);
            throw error;
        }
    }

    /**
     * Validate cart items and reserve stock
     */
    async validateAndProcessCart(cart) {
        const validItems = [];
        let totalAmount = 0;
        const stockReserved = [];

        for (const item of cart.items) {
            try {
                const product = await ProductModel.findById(item.productId._id);
                
                if (!product) {
                    logger.warn(`Product ${item.productId._id} not found, skipping`);
                    continue;
                }

                if (product.count < item.quantity) {
                    logger.warn(`Insufficient stock for ${product.title}. Available: ${product.count}, Requested: ${item.quantity}`);
                    continue;
                }

                // Reserve stock by deducting it
                product.count -= item.quantity;
                await product.save();
                
                stockReserved.push({
                    productId: product._id,
                    quantity: item.quantity,
                    originalStock: product.count + item.quantity
                });

                validItems.push({
                    productId: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    product: product
                });

                totalAmount += product.price * item.quantity;
                
            } catch (error) {
                logger.error(`Error processing cart item ${item.productId._id}: ${error.message}`);
            }
        }

        return { validItems, totalAmount, stockReserved };
    }

    /**
     * Restore stock if order creation fails
     */
    async restoreStock(stockReserved) {
        try {
            for (const item of stockReserved) {
                const product = await ProductModel.findById(item.productId);
                if (product) {
                    product.count = item.originalStock;
                    await product.save();
                    logger.info(`Stock restored for product ${product.title}: ${item.quantity} units`);
                }
            }
        } catch (error) {
            logger.error(`Error restoring stock: ${error.message}`);
        }
    }

    /**
     * Clear cart after successful order
     */
    async clearCart(cartId) {
        try {
            await CartModel.findByIdAndDelete(cartId);
            logger.info(`Cart ${cartId} cleared successfully`);
        } catch (error) {
            logger.error(`Error clearing cart: ${error.message}`);
        }
    }

    /**
     * Get user delivery address
     */
    async getUserDeliveryAddress(userId) {
        try {
            const user = await UserModel.findById(userId);
            if (!user || !user.address) {
                throw new Error("User or delivery address not found");
            }
            
            return {
                street: user.address.street,
                city: user.address.city,
                state: user.address.state,
                postalCode: user.address.postalCode,
                country: user.address.country
            };
        } catch (error) {
            logger.error(`Error getting user delivery address: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new CartProcessingService();
