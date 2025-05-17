/**
 * @swagger
 * tags:
 *  name: Permissions
 *  description: permission module
 */

/**
 * @swagger
 *  definitions:
 *      publicDefinition:
 *          type: object
 *          properties:
 *              statusCode:                 
 *                  type: integer
 *                  example: 20X
 *              data:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "the best message for that action"
 */

/**
 * @swagger
 *  definitions:
 *      ListOfPermissions:
 *          type: object
 *          properties:
 *              statusCode: 
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      permissions:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  title:
 *                                      type: string
 *                                      example: "title of permission"
 *                                  description:
 *                                      type: string
 *                                      example: "desc of permission"
 *                                          
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Permission:
 *              type: object
 *              required:
 *                  -   name
 *                  -   description
 *              properties:
 *                  name:
 *                      type: string
 *                      description: the title of permission
 *                  description:
 *                      type: string
 *                      description: the describe of permission
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Permission:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                      description: the title of permission
 *                  description:
 *                      type: string
 *                      description: the desc of permission
 */
/**
 * @swagger
 * /admin-panel/permission/list:
 *  get:
 *      summary: get all Permissions    
 *      tags:   
 *          -   Permissions
 *      responses:
 *          200:
 *              description: get all permissions
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/ListOfPermissions'
 * 
 */

/**
 * @swagger
 * /admin-panel/permission/add:
 *  post:
 *      summary: create new Permission
 *      tags:
 *          -   Permissions    
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Permission'
 *          
 *      responses:
 *          201:
 *              description: created new Permission
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 * /admin-panel/permission/remove/{id}:
 *  delete:
 *      summary: delete Permission
 *      tags:
 *          -   Permissions   
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              required: true
 *      responses:
 *          200:
 *              description: created new Permission
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */

/**
 * @swagger
 * /admin-panel/permission/update/{id}:
 *  patch:
 *      summary: edit the Permission
 *      tags: 
 *      parameters:
 *          -   in: path
 *              name: id
 *              type: string
 *              required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Edit-Permission'
 *      
 *      responses:
 *          200:
 *              description: edit the Permission
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */
