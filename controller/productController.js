const slugify = require('slugify');
const productModel = require('../models/productModel');
const categoryModel = require('../models/categoryModel');
const fs = require('fs');

const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(401).json({ success: false, message: "Product name is required." });
            case !description:
                return res.status(401).json({ success: false, message: "Product description is required." });
            case !price:
                return res.status(401).json({ success: false, message: "Product price is required." });
            case !category:
                return res.status(401).json({ success: false, message: "Product category is required." });
            case !quantity:
                return res.status(401).json({ success: false, message: "Product quantity is required." });
            case photo && photo.size > 1000000:
                return res.status(401).json({ success: false, message: "Photo is required and size should be less than 1mb" });
        }
        const product = new productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }
        await product.save();
        res.status(201).json({ success: true, message: "Product created successfully", product });
    } catch (error) {
        console.log("Error in create product controller", error);
        res.status(500).json({ success: false, message: "Failed to create product", error });
    }
}

const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).select("-photo").populate("category").limit(12).sort({ createdAt: -1 });
        res.status(200).json({ success: true, totalCount: products.length, message: "Products fetched successfully", products });
    } catch (error) {
        console.log("Error in get product controller", error);
        res.status(500).json({ success: false, message: "Failed to fetch products." });
    }
}

const getSingleProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await productModel.findOne({ slug }).select("-photo").populate("category");
        res.status(200).json({ success: true, message: "Product fetched successfully.", product });
    } catch (error) {
        console.log("Error in single product get", error);
        res.status(500).json({ success: false, message: "Failed to fetch product." });
    }
}

const productPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id).select("photo");
        if (!product.photo.data) {
            res.status(404).json({ success: false, message: "Image not found." });
        }
        res.set("Content-type", product.photo.contentType);
        res.status(200).send(product.photo.data);
    } catch (error) {
        console.log("error in product photo", error);
        res.status(500).json({ success: false, message: "Failed to fetch photo", error });
    }
}

const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.log("error in delete product", error);
        res.status(200).json({ success: false, message: "Failed to delete product." });
    }
}

const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;
        switch (true) {
            case !name:
                return res.status(401).json({ success: false, message: "Product name is required." });
            case !description:
                return res.status(401).json({ success: false, message: "Product description is required." });
            case !price:
                return res.status(401).json({ success: false, message: "Product price is required." });
            case !category:
                return res.status(401).json({ success: false, message: "Product category is required." });
            case !quantity:
                return res.status(401).json({ success: false, message: "Product quantity is required." });
            case photo && photo.size > 1000000:
                return res.status(401).json({ success: false, message: "Photo is required and size should be less than 1mb" });
        }
        const products = await productModel.findByIdAndUpdate(
            req.params.id,
            { ...req.fields, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }
        await products.save();
        res.status(200).json({ success: true, message: "Product updated successfully", products });
    } catch (error) {
        console.log("Error in update product controller", error);
        res.status(500).json({ success: false, message: "Failed to update product", error });
    }
}

const getProductFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productModel.find(args).select("-photo");
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log("Error in filter controller", error);
        res.status(500).json({ success: false, message: "Failed to filter products", error });
    }
}

const getProductCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount();
        res.status(200).json({ success: true, message: "Successful.", total });
    } catch (error) {
        console.log("error in product count", error);
        res.status(500).json({ success: false, message: "Failed to fetch product count", error });
    }
}

const getProductPerPageController = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log("Error in getProductPerPageController", error);
        res.status(500).json({ success: false, message: "Failed to fetch.", error });
    }
}

const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }).select("-photo");
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.log("Error in search product", error);
        res.status(500).json({ success: false, message: "Failed to fetch searched product", error });
    }
}

const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pi }
        }).select("-photo").limit(5).populate("category");
        res.status(200).json({ success: true, products });
    } catch (error) {
        console.log("error in related products", error);
        res.status(500).json({ success: false, message: "Failed to fetch related products.", error });
    }
}

const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productModel.find({ category }).select("-photo").populate("category");
        res.status(200).json({ success: true, category, products });
    } catch (error) {
        console.log("Error in productCategoryController", error);
        res.status(500).json({ success: false, message: "Faild to fetch products.", error });
    }
}

module.exports = {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    getProductFilterController,
    getProductCountController,
    getProductPerPageController,
    searchProductController,
    relatedProductController,
    productCategoryController
}