const mongoose = require("mongoose")

const cartItemSchema = new mongoose.Schema({
  productId : {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
  quantity: {type: Number, required: true, min: 1}
}, { _id: false })

const CartSchema = new mongoose.Schema({
  userId : {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  items: [cartItemSchema],
  expiresAt: {type: Date, default: Date.now() + 30 * 60 * 1000} // 30 minutes
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better performance
CartSchema.index({ userId: 1 })
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index for automatic cleanup

// Virtual for cart total
CartSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0)
})

// Pre-save middleware to ensure cart doesn't expire in the past
CartSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000)
  }
  next()
})

const CartModel = mongoose.model("Cart", CartSchema)
module.exports = CartModel