/**
 * @swagger
 * tags:
 *  name: Role
 *  description: Role module
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
 *      ListOfRoles:
 *          type: object
 *          properties:
 *              statusCode: 
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      role:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  title:
 *                                      type: string
 *                                      example: "title of role"
 *                                  description:
 *                                      type: string
 *                                      example: "desc of role"
 *                                  permission:
 *                                      type: array
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              _id:
 *                                                  type: string
 *                                                  example: "62822e4ff68cdded54aa928d"
 *                                              title:
 *                                                  type: string
 *                                                  example: "title of permission"
 *                                              description:
 *                                                  type: string
 *                                                  example: "describe the permission"
 *                                          
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
 *  components:
 *      schemas:
 *          Role:
 *              type: object
 *              required:
 *                  -   title
 *                  -   description
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of role
 *                  description:
 *                      type: string
 *                      description: the desc of role
 *                  permissions:
 *                      type: array
 *                      description: the permissionsID for role
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Edit-Role:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of role
 *                  description:
 *                      type: string
 *                      description: the desc of role
 *                  permissions:
 *                      type: array
 *                      description: the permissionsID for role
 */
/**
 * @swagger
 * /admin-panel/role/list:
 *  get:
 *      summary: get all Role      
 *      tags: 
 *          -   Role
 *      responses:
 *          200:
 *              description: get all Role
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/ListOfRoles'
 * 
 */
/**
 * @swagger
 * /admin-panel/role/add:
 *  post:
 *      summary: create new Role
 *      tags:
 *          -   Role 
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/Role'
 *          
 *      responses:
 *          201:
 *              description: created new Role
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */

/**
 * @swagger
 * /admin-panel/role/update/{id}:
 *  patch:
 *      summary: edit the Role
 *      tags: 
 *          -   Role
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
 *                      $ref: '#/components/schemas/Edit-Role'
 *          
 *      responses:
 *          200:
 *              description: edited the Role
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */
/**
 * @swagger
 * /admin-panel/role/remove/{field}:
 *  delete:
 *      summary: remove the Role
 *      tags:
 *          -   Role 
 *      parameters:
 *          -   in: path
 *              name: field
 *              type: string
 *              required: true    
 *              description: send title of role or objectId of role for remove that    
 *      responses:
 *          200:
 *              description: removed the Role
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 * 
 */