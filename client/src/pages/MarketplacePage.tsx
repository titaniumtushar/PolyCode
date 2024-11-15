import React, { useState } from "react";
import MainHeading from "../components/MainHeading";
import ProductShowcase from "../components/ProductShowcase";
import { Link } from "react-router-dom"; // Assuming you're using React Router

// Example product data (replace with your actual API or data fetching logic)
const initialProducts = [
  {
    id: 1,
    name: "Worlds of Wonder",
    price: "FREE (Allowlist)",
    image: "path-to-image.jpg",
    minting: "Now",
  },
  {
    id: 2,
    name: "FRACtured",
    price: "0.5 APT",
    image: "path-to-image.jpg",
    minting: "Now",
  },
];

const MarketplacePage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Add new product to the marketplace (this function will be passed to ListProductPage)
  const handleAddProduct = (newProduct: any) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

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

      {/* Product List */}
      <div className="flex flex-wrap justify-center space-x-4 p-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-60 p-4 bg-gray-800 text-white rounded-md shadow-md cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded-md"
            />
            <h3 className="text-lg font-bold">{product.name}</h3>
            <p className="text-sm">Minting: {product.minting}</p>
            <p className="text-sm">Price: {product.price}</p>
          </div>
        ))}
      </div>

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
