const { CreateCategoryController, UpdateCategoryController, GetAllCategoriesController, GetSingleCategoryController, DeleteCategoryController } = require('../controller/categoryController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// create category
router.post('/create-category', requireSignIn, isAdmin, CreateCategoryController)

// update category
router.put('/update-category/:id', requireSignIn, isAdmin, UpdateCategoryController)

// all categories
router.get('/get-categories', GetAllCategoriesController);

// single category
router.get('/single-category/:slug', GetSingleCategoryController);

// deleting category
router.delete('/delete-category/:id', requireSignIn, isAdmin, DeleteCategoryController);

module.exports = router;