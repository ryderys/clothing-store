const mongoose = require("mongoose")

const savedItemsSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    items: [
        {
            productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
            savedAt: {type: Date, default: Date.now},
        }
    ],
})
const savedItemsModel = mongoose.model('SavedItems', savedItemsSchema)

module.exports = {
    savedItemsModel
}