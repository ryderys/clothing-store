const autoBind = require("auto-bind");
const OrderModel = require("../orders/orders.model");
const roles = require("../RBAC/roles");
const { StatusCodes } = require("http-status-codes");
const permissions = require("../RBAC/permissions");
const { logger } = require("../../common/utils/logger");
const { UserModel } = require("../user/user.model");
const { addRoleSchema, addPermissionSchema } = require("../../common/validations/RBAC.schmea");
const { default: mongoose } = require("mongoose");
const { RoleModel } = require("../RBAC/role.model");
const createHttpError = require("http-errors");
const { PermissionModel } = require("../RBAC/permissions.model");
const { deleteInvalidPropertyInObject } = require("../../common/utils/functions");



class AdminController{
    constructor(){
        autoBind
    }

    async getAllRoles(req, res, next){
        try {
            const role = await RoleModel.find({})
            if(!role) throw createHttpError.InternalServerError("نقش یافت نشد")
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    role
                }
            })
        } catch (error) {
            next(error)
        }
    }
    async addRole(req, res, next){
        try {
            const {title, permissions} = await addRoleSchema.validateAsync(req.body)
            await this.findRoleWithTitle(title)
            const role = await RoleModel.create({title, permissions})
            if(!role) throw createHttpError.InternalServerError("نقش ایجاد نشد")
            return res.status(StatusCodes.CREATED).json({
                statusCode: StatusCodes.CREATED,
                data: {
                    message: "نقش ایجاد شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async removeRole(req, res, next){
        try {
            const {filed} = req.params;
            const role = await this.findRoleWithTitleOrId(filed)
            const {deletedCount} = await RoleModel.deleteOne({_id: role._id})
            if(!deletedCount) throw createHttpError.InternalServerError("حذف نقش انجام نشد")
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "نقش حذف شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async updateRoleById(req, res, next){
        try {
            const {id} = req.params;
            const role = await this.findRoleWithTitleOrId(id)            
            const data =  {... req.body}
            deleteInvalidPropertyInObject(data, [])
            const {modifiedCount} = await RoleModel.updateOne({_id: role._id}, {$set: data})
            if(!modifiedCount) throw createHttpError.InternalServerError("ویرایش نقش انجام نشد")
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "ویرایش نقش انجام شد"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async getAllPermissions(req, res, next){
        try {
            const permissions = await PermissionModel.find({})
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    permissions
                } 
            })
        } catch (error) {
            next(error)
        }
    }
    async addPermission(req, res, next){
        try {
        const {name, description} = await addPermissionSchema.validateAsync(req.body);
        await this.findPermissionWithName(name)
        const permission = await PermissionModel.create({name, description})
        if(!permission) throw createHttpError.InternalServerError("دسترسی ایجاد نشد")

        return res.status(StatusCodes.CREATED).json({
            statusCode: StatusCodes.CREATED,
            data: {
                message: "Permission added successfully"
            }
        })
        } catch (error) {
            next(error)    
        }
    }

    async removePermission(req, res, next){
        try {
        const {id} = req.params;;
        await this.findPermissionWithId(id)

        const {deletedCount} = await PermissionModel.deleteOne({_id: id})
        if(!deletedCount) throw createHttpError.InternalServerError("دسترسی حذف نشد")

        return res.status(StatusCodes.OK).json({
            statusCode: StatusCodes.OK,
            data: {
                message: "Permission deleted successfully"
            }
        })
        } catch (error) {
            next(error)    
        }
    }

    async updatePermissionById(req, res, next){
        try {
            const {id} = req.params;
            await this.findPermissionWithId(id)
            const data = {... req.body}
            deleteInvalidPropertyInObject(data, [])
            const {modifiedCount} = await PermissionModel.updateOne({_id: id}, {$set: data})
            if(!modifiedCount) throw createHttpError.InternalServerError("ویرایش انجام نشد")
            return res.status(StatusCodes.OK).json({
                statusCode: StatusCodes.OK,
                data: {
                    message: "Permission updated successfully"
                }
            })
        } catch (error) {
            next(error)
        }
    }
    

    async findRoleWithTitle(title){
        const role = await RoleModel.findOne({title})
        if(role) throw createHttpError.NotFound("نقش مورد نظر قبلا ثبت شده")
    }
    async findRoleWithTitleOrId(filed){
        let find = mongoose.isValidObjectId(filed) ? {_id: filed} : {title: filed}
        const role = await RoleModel.findOne(find)
        if(!role) throw createHttpError.NotFound("نقش مورد نظر یافت نشد")
        return role
    }

    async findPermissionWithName(name){
        const permission = await PermissionModel.findOne({name})
        if(permission) throw createHttpError.BadRequest("دترسی قبلا ثبت شده")
    }
    async findPermissionWithId(_id){
        const permission = await PermissionModel.findOne({_id})
        if(!permission) throw createHttpError.NotFound("دسترسی یافت نشد ")
        return permission
    }

    // async assignAdminRole(req, res, next){
    //     try {
    //         const {userId} = req.body;

    //         const user = await UserModel.findById(userId)
    //         if(!user){
    //             return res.status(StatusCodes.NOT_FOUND).json({
    //                 statusCode: StatusCodes.NOT_FOUND,
    //                 data: {
    //                     message: "user not found"
    //                 }
    //             })
    //         }
    //         user.role = 'admin'
    //         return res.status(StatusCodes.OK).json({
    //             data: {
    //                 message: "user role updated to admin"
    //             }
    //         })
    //     } catch (error) {
    //         next(error)
    //     }
    // }


}

module.exports = new AdminController()