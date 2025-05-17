const { logger } = require("./logger");

function NotFoundHandler(app) {
    app.use((req, res, next) => {
        res.status(404).json({
            message: "Not Found Route"
        })
    })
}

function AllExceptionHandler(app) {
    app.use((err, req, res, next) => {
        let status = err?.status ?? err?.statusCode ?? err?.code;
        if(!status || isNaN(+status) || status > 511 || status < 200) status = 500;
        logger.error({
            message: err.message,
            stack: err.stack,
            status,
            path: req.originalUrl,
            method: req.method
        })
        res.status(status).json({
            message: err?.message || "InternalServerError"
        })
    })
}

module.exports = {
    NotFoundHandler,
    AllExceptionHandler
}