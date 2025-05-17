const autoBind = require("auto-bind");
const httpError = require("http-errors")
const {StatusCodes} = require("http-status-codes");
const { CategoryModel } = require("./category.model");
const { isValidObjectId, Types ,Schema, Mongoose } = require("mongoose");
const { default: slugify } = require("slugify");
const { createCategorySchema } = require("../../common/validations/category.validation");
const FeaturesModel = require("../features/features.model");
const { CategoryMessages } = require("./category.messages");
const { logger } = require("../../common/utils/logger");

class CategoryController{
    constructor(){
        autoBind(this)
    }

    async createCategory(req, res, next){
        try {
            const validatedCategory = await createCategorySchema.validateAsync(req.body)
            let {title, icon, slug, parent} = validatedCategory;
            let parents = []

            if(parent && isValidObjectId(parent)){
                const existCategory = await this.checkExistCategoryById(parent)
                parent = existCategory._id;
                parents = [
                    ...new Set(
                        ([existCategory._id.toString()].concat(
                            existCategory.parents.map(id => id.toString())
                        )).map(id => new Types.ObjectId(id))
                    )
                ]
            }
            slug = slugify(validatedCategory?.slug || title)
            await this.checkCategorySlugUniqueness(slug)

            const category = await CategoryModel.create({title, icon, slug, parent, parents})
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: CategoryMessages.CategoryCreated,
                    category
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async getAllCategory(req, res, next){
        try {
            const categories = await CategoryModel.find({parent: {$exists: false}})

            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    categories
                }
            })
        } catch (error) {
            logger.error(error)
            next(error)
        }
    }

    async deleteCategoryById(req, res, next){
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                throw new httpError.BadRequest(CategoryMessages.InvalidCategoryId);
            }
            await this.checkExistCategoryById(id)
            await this.deleteCategoryAndChildren(id)
            
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: CategoryMessages.CategoryDeleted
                }
            })
        } catch (error) {
            logger.error()
            next(error)
        }
    }

    async deleteCategoryAndChildren(categoryId){
        const category = await this.checkExistCategoryById(categoryId)
        if(category){
            const subCategories = await CategoryModel.find({parent: categoryId})
            for (const subCategory of subCategories) {
                await this.deleteCategoryAndChildren(subCategory._id)
            }
            await FeaturesModel.deleteMany({category: categoryId})
            await CategoryModel.deleteOne({_id: categoryId})
        }
    }

    async checkExistCategoryById(id){
        const category = await CategoryModel.findById(id)
        if(!category) throw new httpError.NotFound(CategoryMessages.CategoryNotFound)
        return category
    }
    
    async checkCategorySlugUniqueness(slug) {
        const category = await CategoryModel.findOne({ slug });
        if (category) throw new httpError.Conflict(CategoryMessages.CategoryExists);
        return null;
    }
}

module.exports = new CategoryController()