import { Request, Response } from "express";
import Product from "../models/product";

/**
 * Add a list of products to the database
 */
export const addProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    const products = req.body;

    // Check if the request body is an array of products
    if (!Array.isArray(products)) {
        res.status(400).json({
            success: false,
            message: "Input should be an array of products.",
        });
        return;
    }

    // Define required fields for each product
    const requiredFields = ["storeName", "price", "imgUrl", "description"];

    // Validate that all required fields are present for each product
    for (const product of products) {
        for (const field of requiredFields) {
            if (!product[field]) {
                res.status(400).json({
                    success: false,
                    message:
                        "All fields (storeName, price, imgUrl, description) are required.",
                });
                return;
            }
        }
    }

    try {
        const savedProducts = await Product.insertMany(products);
        res.status(201).json({
            success: true,
            message: "Products saved successfully.",
            data: savedProducts,
        });
    } catch (error) {
        console.error("Error saving products:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while saving products.",
        });
    }
};

/**
 * Fetch all products from the database
 */
export const getProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products,
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching products.",
        });
    }
};
