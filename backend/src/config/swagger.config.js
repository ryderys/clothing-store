const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = swaggerJsDoc({
    swaggerDefinition: {
        openapi: "3.0.1",
        info: {
            title: "online-shop",
            description: "shop project",
            version: "1.0.0",
        },
    },
   apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
   })

const swagger = swaggerUi.setup(swaggerDocument, {explorer: true})
module.exports = (app) => {
    app.use("/swagger", swaggerUi.serve, swagger)
}
