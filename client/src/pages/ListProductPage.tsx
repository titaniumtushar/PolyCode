import { useState } from "react";
import { API_URL } from "../App";

interface Product {
    name: string;
    price: number;
    image: string;
    description: string;
}

const ListProductPage = () => {
    const [productDetails, setProductDetails] = useState<Product>({
        name: "",
        price: 0,
        image: "",
        description: "",
    });
    const [submittedProduct, setSubmittedProduct] = useState<Product | null>(
        null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setProductDetails({
            ...productDetails,
            [e.target.name]: e.target.value,
        });
    };

    // Handle product submission using fetch
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Start loading state and reset error message
        setIsLoading(true);
        setErrorMessage(null);

        const payload = [
            {
                storeName: productDetails.name,
                price: productDetails.price,
                imgUrl: productDetails.image,
                description: productDetails.description,
            },
        ];

        try {
            const response = await fetch(
                `${API_URL}/api/community/product/list`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await response.json();
            console.log(data, "this is the response");

            if (response.ok) {
                // Assuming the backend returns the product data
                setSubmittedProduct(data.data);
                setProductDetails({
                    name: "",
                    price: 0,
                    image: "",
                    description: "",
                });
                alert("Product listed successfully!");
            } else {
                alert("Error creating product.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating product.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-8 flex justify-center">
                <div className="w-full max-w-lg p-6 border-4 border-neon-blue rounded-lg space-y-4 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-purple-400">
                        List a New Product
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-purple-400">
                                Product Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={productDetails.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-black text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-purple-400">
                                Price (in credits)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={productDetails.price}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-black text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-purple-400">
                                Product Image URL
                            </label>
                            <input
                                type="text"
                                name="image"
                                value={productDetails.image}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-black text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-purple-400">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={productDetails.description}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-lg bg-black text-white"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Listing Product..." : "List Product"}
                        </button>
                    </form>

                    {submittedProduct && (
                        <div className="mt-8 border-4 border-neon-blue rounded-lg p-4">
                            <h3 className="text-xl font-bold text-purple-400">
                                Submitted Product:
                            </h3>
                            <img
                                src={submittedProduct.image}
                                alt={submittedProduct.name}
                                className="w-15 h-48 object-cover mb-4 mx-auto"
                            />
                            <h4 className="text-lg font-bold">
                                {submittedProduct.name}
                            </h4>
                            <p>Price: {submittedProduct.price} credits</p>
                            <p>{submittedProduct.description}</p>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="mt-4 text-red-500">
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListProductPage;
