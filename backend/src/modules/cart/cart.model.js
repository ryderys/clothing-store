const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  productId : {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
  quantity: {type: Number, required: true}

})
const CartSchema = new mongoose.Schema({
  userId : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  items: [cartItemSchema],
  expiresAt: {type: Date, default: Date.now() + 30 * 60 * 1000} // 30 minutes

})


const CartModel = mongoose.model("Cart", CartSchema)
module.exports = CartModel