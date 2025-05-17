const { AdminPanelRouter } = require("./modules/admin/admin.routes")
const { AuthRouter } = require("./modules/auth/auth.routes")
const { CartRouter } = require("./modules/cart/cart.routes")
const { AdminApiCategoryRouter } = require("./modules/category/category.routes")
const { AdminApiFeatureRouter } = require("./modules/features/features.routes")
const { OrderRouter } = require("./modules/orders/orders.routes")
const { AdminApiProductRouter } = require("./modules/product/products.routes")
const { ReviewsRouter } = require("./modules/reviews/review.routes")
const { SavedItemsRouter } = require("./modules/savedItems/savedItems.routes")
const { UserRouter } = require("./modules/user/user.routes")

const mainRouter = require("express").Router()

mainRouter.use("/auth", AuthRouter)
mainRouter.use("/user", UserRouter)
mainRouter.use("/admin-panel", AdminPanelRouter)
mainRouter.use("/products", AdminApiProductRouter)
mainRouter.use("/category", AdminApiCategoryRouter)
mainRouter.use("/feature", AdminApiFeatureRouter)

mainRouter.use("/cart", CartRouter)
mainRouter.use("/saved-items", SavedItemsRouter)
mainRouter.use("/orders", OrderRouter)
mainRouter.use("/review", ReviewsRouter)

module.exports = mainRouter