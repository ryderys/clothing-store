const autoBind = require("auto-bind");
const { checkExistCategoryById } = require("../category/category.controller");
const { default: slugify } = require("slugify");
const httpError = require("http-errors")
const FeaturesModel = require("./features.model");
const { StatusCodes } = require("http-status-codes");
const { createFeatureSchema, updateFeatureSchema } = require("../../common/validations/features.validation");
const { CategoryModel } = require("../category/category.model");
const { default: mongoose } = require("mongoose");
const { FeaturesMessages } = require("./features.messages");
const { logger } = require("../../common/utils/logger");

class featuresController{
    constructor() {
        autoBind(this)
    }
    async addFeature(req, res, next){
        try {
            const featureBody = await createFeatureSchema.validateAsync(req.body)
            let {title, key, type,  list, guid, category} = featureBody;

            category = await checkExistCategoryById(category)
            category = category._id;

            key = slugify(key, {trim: true, replacement: "_", lower: true})

            await this.alreadyExistByCategoryAndKey(key, category)
            
            if(list && typeof list === "string"){
                list = list.split(",")
            }else if (!Array.isArray(list)) list = [];
            
            const feature = await FeaturesModel.create({title, key , type, list , guid, category})
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: FeaturesMessages.FeatureCreated,
                    feature
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async updateFeature(req, res, next){
        try {
            const {id} = req.params
            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new httpError.BadRequest(FeaturesMessages.InvalidId)
            }

            const featureBody = await updateFeatureSchema.validateAsync(req.body)
            let {title, key, type, list, guid, category} = featureBody

            const existingFeature = await this.checkExistById(id)

            if(category){
                category = await checkExistCategoryById(category)
                category = category._id;
            }else {
                category = existingFeature.category
            }

            if(key){
                key = slugify(key, {trim: true, replacement: "_", lower: true})
                await this.alreadyExistByCategoryAndKey(key, category, id)
            }

            if(list && typeof list === "string"){
                list = list.split(',')
            }else if(!Array.isArray(list)){
                list = []
            }

            const updatedData = {title, key, type, list, guid, category}
            Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key])

            const updatedFeature = await FeaturesModel.findByIdAndUpdate(id, updatedData,
                {new: true}
            )
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: FeaturesMessages.FeatureUpdated,
                    feature: updatedFeature
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }


    async findAllFeatures(req, res, next){
       try {
        const features = await FeaturesModel.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: "$category"
            },
            {
                $group: {
                    _id: "$category._id",
                    category: { $first: "$category"},
                    features: {
                        $push: {
                            _id: "$_id",
                            title: "$title",
                            key: "$key",
                            type: "$type",
                            list: "$list",
                            guid: "$guid",
                        }
                    }
                }
            },
            {
                $project: {
                    "category.__v": 0,
                    "category.parents": 0,
                    "category._id": 0,
                }
            },
            {
                $project: {
                    _id: 1,
                    category: 1,
                    features: 1
                }
            },
            {
                $sort: {"_id": -1}
            }
        ])
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                features
            }
        })
       } catch (error) {
            logger.error(error)
            next(error)
       }

    }

    async findFeatureByCategoryId(req, res, next){
        const {categoryId} = req.params
        if(!mongoose.Types.ObjectId.isValid(categoryId)){
            throw new httpError.BadRequest(FeaturesMessages.InvalidId)
        }
        const feature = await FeaturesModel.find({category: categoryId},{__v: 0}).populate({path: "category", select: "name slug"})
        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                feature
            }
        })
    }

    async findByCategorySlug(req, res, next){
        try {
            const {slug} = req.params;
            const category = await this.checkExistCategoryBySlug(slug)
            const features = await FeaturesModel.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "category",
                        foreignField: "_id",
                        as: "category"
                    }
                },
                {
                    $unwind: "$category"
                },
                {
                    $addFields: {
                        categorySlug: "$category.slug",
                        categoryTitle: "$category.title",
                        categoryIcon: "$category.icon",
                    }
                },
                {
                    $project: {
                        category: 0,
                        __v: 0
                    }
                },
                {
                    $match: {
                        categorySlug: slug
                    }
                }

            ])
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    features
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }
    
    async removeFeatureById(req, res, next){
        try {
            const {id} = req.params;
            if(!mongoose.Types.ObjectId.isValid(id)){
                throw new httpError.BadRequest(FeaturesMessages.InvalidId)
            }
            await this.checkExistById(id)
            await FeaturesModel.deleteOne({_id: id})
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: FeaturesMessages.FeatureDeleted
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }



    async checkExistById(id){
        const features = await FeaturesModel.findById(id)
        if(!features) throw new httpError.NotFound(FeaturesMessages.FeatureNotFound)
        return features
    }

    async checkExistCategoryBySlug(slug){
        const category = await CategoryModel.findOne({slug})
        if(!category) throw new httpError.NotFound(FeaturesMessages.CategoryNotFound)
        return category
    }

    async alreadyExistByCategoryAndKey(key, category, exceptionId = null){
        try {
            const isExist = await FeaturesModel.findOne({category, key, _id: {$ne: exceptionId}})
            if(isExist) throw new httpError.Conflict(FeaturesMessages.FeatureExist)
        } catch (error) {
            throw error
        }
    }
}
module.exports = new featuresController()