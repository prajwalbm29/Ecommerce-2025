const categoryModel = require("../models/categoryModel");
const slugify = require('slugify');

const CreateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(401).json({ success: false, message: "Category name is required." });
        }
        const existingCategory = await categoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(200).json({ success: false, message: "Category already exists." });
        }
        const category = await new categoryModel({ name, slug: slugify(name) }).save();
        res.status(201).json({ success: true, message: "Category created successfully", category });
    } catch (error) {
        console.log("Error in create category", error);
        res.status(500).json({ success: false, message: "Failed to create category.", error });
    }
}

const UpdateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.status(401).json({ success: false, message: "Category name is required." });
        }
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });
        res.status(200).json({ success: true, message: "Category updated successfully", category });
    } catch (error) {
        console.log("Error in update category controller", error);
        res.status(500).json({ success: false, message: "Failed to update category." });
    }
}

const GetAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json({ success: true, message: "All categories list.", categories });
    } catch (error) {
        console.log("Error in getting all categories controller", error);
        res.status(500).json({ success: false, message: "Failed to fetch the caterogies.", error });
    }
}

const GetSingleCategoryController = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        res.status(200).json({ success: true, message: "Category found", category });
    } catch (error) {
        console.log("Error in getting single category", error);
        res.status(500).json({ success: false, message: "Failed to fetch the category.", error });
    }
}

const DeleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Category deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete category", error });
    }
}

module.exports = {
    CreateCategoryController,
    UpdateCategoryController,
    GetAllCategoriesController,
    GetSingleCategoryController,
    DeleteCategoryController,
    
}