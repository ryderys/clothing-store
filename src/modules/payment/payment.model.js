const { default: mongoose } = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    status: {type: Boolean, default: false},
    amount: {type: Number, required: true, min: 0},
    refId: {type: String, trim: true},
    authority: {type: String, trim: true, required: true},
    orderId: {type: mongoose.Types.ObjectId, ref: "Order", required: true},
    userId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    cartId: {type: mongoose.Types.ObjectId, ref: "Cart", required: true}
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Indexes for better performance
PaymentSchema.index({ userId: 1 })
PaymentSchema.index({ orderId: 1 })
PaymentSchema.index({ cartId: 1 })
PaymentSchema.index({ authority: 1 }, { unique: true, sparse: true })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ createdAt: -1 })

// Virtual for payment status text
PaymentSchema.virtual('statusText').get(function() {
    return this.status ? 'Completed' : 'Pending'
})

// Pre-save middleware to ensure authority is unique
PaymentSchema.pre('save', async function(next) {
    if (this.isModified('authority') && this.authority) {
        const existingPayment = await this.constructor.findOne({ 
            authority: this.authority, 
            _id: { $ne: this._id } 
        })
        if (existingPayment) {
            return next(new Error('Payment authority must be unique'))
        }
    }
    next()
})

const PaymentModel = mongoose.model("Payment", PaymentSchema)
module.exports = {
    PaymentModel
}