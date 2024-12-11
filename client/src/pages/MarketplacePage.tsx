import React, { useState, useEffect } from "react";
import MainHeading from "../components/MainHeading";
import ProductShowcase from "../components/ProductShowcase";
import { Link } from "react-router-dom"; // Assuming you're using React Router
import { API_URL } from "../App";

const MarketplacePage = () => {
    const [products, setProducts] = useState<any[]>([]); // Change type to any[] for dynamic data
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/api/community/product/list`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `BEARER ${localStorage.getItem(
                                "token"
                            )}`, // Add token if needed
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();
                setProducts(data.data);
                console.log(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setErrorMessage("Failed to load products.");
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleProductClick = (product: any) => {
        setSelectedProduct(product);
    };

    return (
        <div>
            {/* Marketplace Heading */}
            <h1 className="text-center text-4xl font-bold text-purple-500 mt-10">
                Marketplace
            </h1>

            {/* Link to List a new product */}
            <div className="text-center mt-4">
                <Link
                    to="/list-product"
                    className="bg-purple-600 text-white py-2 px-4 rounded-md"
                >
                    List a New Product
                </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center text-white mt-4">
                    Loading products...
                </div>
            )}

            {/* Error Handling */}
            {errorMessage && (
                <div className="text-center text-red-500 mt-4">
                    {errorMessage}
                </div>
            )}

            {/* Product List */}
            {!isLoading && !errorMessage && (
                <div className="flex flex-wrap justify-center space-x-4 p-8">
                    {products.map((product) => (
                        <div
                            key={product._id} // Use _id as the unique identifier
                            className="w-60 p-4 bg-gray-800 text-white rounded-md shadow-md cursor-pointer"
                            onClick={() => handleProductClick(product)}
                        >
                            <img
                                src={product.imgUrl}
                                alt={product.storeName}
                                className="w-full h-40 object-cover mb-2 rounded-md"
                            />
                            <h3 className="text-lg font-bold">
                                {product.name}
                            </h3>
                            <p className="text-sm">
                                Name: {" " + product.storeName}
                            </p>
                            <p className="text-sm">Price: {product.price}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Showcase Modal */}
            {selectedProduct && (
                <ProductShowcase
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default MarketplacePage;
