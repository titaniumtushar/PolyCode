// models/product.ts
import { Schema, model, Document } from "mongoose";

// Define the Product Schema
const productSchema = new Schema({
    storeName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

// Define the Product interface extending Document
interface IProduct extends Document {
    storeName: string;
    price: number;
    imgUrl: string;
    description: string;
}

// Create the Product model
const Product = model<IProduct>("Product", productSchema);

export default Product;
