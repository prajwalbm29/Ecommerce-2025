const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController } = require('../controller/productController');
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
router.delete("/delete-product", requireSignIn, isAdmin, deleteProductController);

// update product
router.post("/update-product", requireSignIn, isAdmin, formidableMiddleware(), updateProductController);

module.exports = router;