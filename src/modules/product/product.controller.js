const autoBind = require("auto-bind");
const {StatusCodes} = require("http-status-codes")
const { deleteFileInPublic } = require("../../common/utils/functions");
const { ProductModel } = require("./product.model");
const httpError = require("http-errors")
const { createProductSchema, updateProductSchema } = require("../../common/validations/product.validation");
const ObjectIdValidator = require("../../common/validations/public.validations");
const FeaturesModel = require("../features/features.model");
const { ProductMessages } = require("./product.messages");
const { logger } = require("../../common/utils/logger");
const { uploadToS3 } = require("../../common/utils/multer");

class ProductController {
    constructor(){
        autoBind(this)
    }
    async addProduct(req, res, next){
        try {
            let images = [];
            if (req?.files?.length > 0) {
                const uploadPromises = req.files.map(file => uploadToS3(file));
                const uploadResults = await Promise.all(uploadPromises);
                images = uploadResults.map(result => result.url);
            }

            const productBody = await createProductSchema.validateAsync(req.body)
            let {title, summary, description, price, tags, count, category, features } = productBody;
            const supplier = req.user._id;
            
            const categoryFeatures = await this.getCategoryFeatures(category)
            const categoryFeaturesObject = this.convertFeaturesToObject(categoryFeatures);
            const validatedFeatures = this.validateFeatures(features, categoryFeaturesObject);

            const product = await ProductModel.create({
                title,
                summary,
                description,
                price,
                tags,
                count,
                supplier,
                images,
                features: validatedFeatures,
                category
            })

            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: ProductMessages.ProductCreated
                }
            })

        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async editProductById(req, res, next){
        try {
            const {id} = req.params;
            const updates = await updateProductSchema.validateAsync(req.body);
            if(!id || !updates){
                throw new httpError.BadRequest("invalid request")
            }
            
            const product = await this.findProductById(id)

            if(Object.keys(updates).length === 0){
                throw new httpError.BadRequest("no updated provided")
            }

            // If new images are uploaded, upload them to S3
            if (req?.files?.length > 0) {
                const uploadPromises = req.files.map(file => uploadToS3(file));
                const uploadResults = await Promise.all(uploadPromises);
                updates.images = uploadResults.map(result => result.url);
            } else if (!updates.images) {
                updates.images = product.images || []
            } else if(typeof updates.images === "string"){
                updates.images = [updates.images]
            }
        
            if(updates.features){
                const categoryFeatures = await this.getCategoryFeatures(product.category)
                const categoryFeaturesObject = this.convertFeaturesToObject(categoryFeatures)
                updates.features = this.validateFeatures(updates.features, categoryFeaturesObject)
            }

            Object.assign(product, updates)
            await product.save()

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: ProductMessages.ProductUpdated,
                    product
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getAllProducts(req, res, next){
        try {
            const search = req?.query?.search?.trim() || ""
            let matchStage = {}

            if(search){
                matchStage = {
                    $text: { $search: search}
                }
             } 

            const products = await ProductModel.aggregate([
                { $match: matchStage},
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {$unwind: "$category"},
                {
                    $project: {
                        _id: 0,
                    id: "$_id",
                    title: 1,
                    summary: 1,
                    description: 1,
                    price: 1,
                    count: 1,
                    images: 1,
                    tags: 1,
                    features: 1,
                    reviewCount: 1,
                    averageRating: 1,
                    supplier: 1,
                    category: {
                        id: "$category._id",
                        title: "$category.title",
                        slug: "$category.slug",
                        icon: "$category.icon",
                        parent: "$category.parent",
                        children: "$category.children"
                    },
                    createdAt: 1,
                    updatedAt: 1
                }
            },

            ]);

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    products
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getOneProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    product
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async removeProductById(req, res, next){
        try {
            const {id} = req.params;
            const product = await this.findProductById(id)
            const {deletedCount} = await ProductModel.deleteOne({_id: product._id})
            if(deletedCount == 0) throw new httpError.InternalServerError()
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: ProductMessages.ProductDeleted
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
        if(!product) throw new httpError.NotFound(ProductMessages.ProductNotFound)
        return product
    }

    async getCategoryFeatures(categoryId){
        const features = await FeaturesModel.find({category: categoryId})
        return features
    }

    convertFeaturesToObject(features) {
        return features.reduce((obj, feature) => {
            obj[feature.key] = feature;
            return obj;
        }, {});
    }

    validateFeatures(providedFeatures, categoryFeatures) {
        const validatedFeatures = {};
        for (const key in providedFeatures) {
            if (categoryFeatures[key]) {
                validatedFeatures[key] = providedFeatures[key];
            } else {
                throw new httpError.BadRequest(`Feature '${key}' is not valid for the selected category`);
            }
        }
        return validatedFeatures;
    }

    async deleteUploadedFiles(files){
        if(files){
            files.forEach(file => {
                deleteFileInPublic(file.path.slice(7))
            })
        }else {
            return 
        }
    }
    async uploadFiles(files){
        const uploadedFiles = []
        files.forEach((file) => {
            const filePath = file.path.slice(7)
            uploadedFiles.push(filePath)
        })
        return uploadedFiles
    }

}


module.exports = {
    ProductController: new ProductController()
}