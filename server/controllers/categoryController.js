import express from 'express';
import slugify from 'slugify';
import Category from '../models/categorymodel.js';
import postModel from "../models/postmodel.js";


// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({ success: false, message: "Category already exists" });
    }

    const category = await new Category({
      name,
      slug: slugify(name, { lower: true }),
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error while creating category",
      error,
    });
  }
};

// Get All Categories
export const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 }); // A-Z order
    res.status(200).send({
      success: true,
      message: "All categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch categories",
      error,
    });
  }
};

// Update Category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true }) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).send({
      success: false,
      message: "Failed to update category",
      error,
    });
  }
};

// Get Single Category
export const getSingleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found",
      });
    }

    const posts = await postModel.find({ category: category._id }).populate('category');

    // ✅ Only ONE response
    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
      posts,
    });

  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).send({
      success: false,
      message: "Failed to get category",
      error,
    });
  }
};


// Delete Category
export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).send({
      success: false,
      message: "Failed to delete category",
      error,
    });
  }
};
