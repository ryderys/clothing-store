const {default: mongoose, Schema, Types} = require("mongoose")



const ProductSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true},
    summary: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    tags: {type: [String], required: true},
    category: {type: Types.ObjectId, ref: 'Category'},
    price: {type: Number, required: true, default: 0, min: 0},
    count: {type: Number, default: 0, min: 0, validate: {
        validator: function(v) {
            return typeof v === 'number' && !isNaN(v) && v >= 0;
        },
        message: 'Count must be a valid non-negative number'
    }},
    images: {type: [String], required: false, default: []},
    // likes: {type: [Schema.Types.ObjectId], ref: 'User', default: []},
    supplier: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    features: {type: Object, default: {}},
    averageRating: {type: Number, default: 0, min: 0, max: 5},
    reviewCount: {type: Number, default: 0, min: 0},
}, {
    timestamps: {createdAt: true, updatedAt: true}
})
ProductSchema.index({title : "text", summary : "text", description : "text"})

ProductSchema.virtual("imagesURL").get(function(){
    return this.images.map(image => `${process.env.BASE_URL}:${process.env.PORT}/${image}`)
})
module.exports = {
    ProductModel : mongoose.model("Product", ProductSchema)
}