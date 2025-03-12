const { relatedProductController, productCategoryController, createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, getProductFilterController, getProductCountController, getProductPerPageController, searchProductController, braintreeTokenController, braintreePaymentController } = require('../controller/productController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');
const formidableMiddleware = require('express-formidable');

const router = require('express').Router();

// create product
router.post("/create-product", requireSignIn, isAdmin, formidableMiddleware(), createProductController);

// get products
router.get("/get-products", getProductController);

// single product
router.get("/get-product/:slug", getSingleProductController);

// prdoct photo
router.get("/product-photo/:id", productPhotoController);

// delete product
router.delete("/delete-product/:id", requireSignIn, isAdmin, deleteProductController);

// update product
router.put("/update-product/:id", requireSignIn, isAdmin, formidableMiddleware(), updateProductController);

// filter products
router.post("/product-filters", getProductFilterController);

// product count
router.get("/product-count", getProductCountController);

// product per page
router.get("/product-list/:page", getProductPerPageController);

// search product
router.get("/search/:keyword", searchProductController);

// Related products
router.get("/related-product/:pid/:cid", relatedProductController);

// category products
router.get("/product-category/:slug", productCategoryController);

// payment gatway api
// token
router.get("/braintree/token", requireSignIn, braintreeTokenController);

// payment
router.post("/braintree/payment", requireSignIn, braintreePaymentController);

module.exports = router;