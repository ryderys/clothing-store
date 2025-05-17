const rateLimit = require("express-rate-limit")

const adminRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 150,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

module.exports = adminRateLimiter