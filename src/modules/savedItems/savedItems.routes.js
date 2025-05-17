const Authorization = require("../../common/guard/authorization.guard")
const { checkPermission, checkOwnership } = require("../../common/middleware/checkPermission")
const { savedItemsModel } = require("./savedItem.model")
const savedItemsController = require("./savedItems.controller")


const router = require("express").Router()
// save an item for later
router.post('/save',Authorization, checkPermission('savedItems', 'create'), savedItemsController.saveItemForLater)

//move a saved item to cart
router.post('/move-to-cart', Authorization, checkOwnership(savedItemsModel, 'savedItems', 'updateOwn'), savedItemsController.moveSavedItemToCart)

//view all saved item
router.get('/', Authorization,checkOwnership(savedItemsModel, 'savedItems', 'readOwn') , savedItemsController.viewSavedItems)

//remove an item from saved items
router.post('/remove', Authorization,checkOwnership(savedItemsModel, 'savedItems', 'updateOwn') ,  savedItemsController.removeSavedItem)

//clear all saved items
router.delete('/clear', Authorization,checkOwnership(savedItemsModel, 'savedItems', 'updateOwn') ,savedItemsController.clearSavedItems)

//check if an item is saved
router.post('/is-saved', Authorization, checkOwnership(savedItemsModel, 'savedItems', 'readOwn') ,savedItemsController.isItemSaved)


module.exports = {
    SavedItemsRouter : router
}