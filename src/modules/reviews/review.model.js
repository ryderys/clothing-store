
const { default: mongoose, model } = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    productId: {type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    comment: {type: String},
    createdAt: {type: Date, default: Date.now()},
})

const ReviewModel = model("Review", ReviewSchema)

module.exports = ReviewModel