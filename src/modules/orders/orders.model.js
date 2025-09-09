const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            quantity: {type: Number, required: true, min: 1},
            price: {type: Number, required: true, min: 0}
        }
    ],
    totalAmount: {type: Number, required: true, min: 0},
    // Delivery address (copied from user at time of order)
    deliveryAddress: {
        street: {type: String, required: true, trim: true},
        city: {type: String, required: true, trim: true},
        state: {type: String, required: true, trim: true},
        postalCode: {type: String, required: true, trim: true},
        country: {type: String, required: true, default: 'Iran', trim: true}
    },
    // Delivery information
    delivery: {
        method: {type: String, enum: ['standard', 'express', 'pickup'], default: 'standard'},
        cost: {type: Number, default: 0, min: 0},
        estimatedDays: {type: Number, default: 3, min: 1},
        trackingNumber: {type: String, trim: true},
        notes: {type: String, trim: true}
    },
    status: {
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'out for delivery', 'Delivered', 'cancelled'], 
        default: 'Pending'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// Indexes for better performance
OrderSchema.index({ userId: 1 })
OrderSchema.index({ status: 1 })
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ 'items.productId': 1 })

// Virtual for order summary
OrderSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0)
})

// Pre-save middleware to ensure valid status transitions
OrderSchema.pre('save', async function(next) {
    if (this.isModified('status')) {
        const validTransitions = {
            'Pending': ['Processing', 'Shipped', 'cancelled'],
            'Processing': ['Shipped', 'cancelled'],
            'Shipped': ['out for delivery', 'cancelled'],
            'out for delivery': ['Delivered', 'cancelled'],
            'Delivered': [],
            'cancelled': []
        }
        
        if (this.isNew) return next()
        
        // FIX: Properly get previous status by fetching the document
        const previousDoc = await this.constructor.findById(this._id)
        if (previousDoc && !validTransitions[previousDoc.status]?.includes(this.status)) {
            return next(new Error(`Invalid status transition from ${previousDoc.status} to ${this.status}`))
        }
    }
    next()
})

const OrderModel = mongoose.model('Order', OrderSchema)
module.exports = OrderModel