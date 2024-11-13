import React from "react";

interface ProductProps {
  product: any;
  onClose: () => void;
}

const ProductShowcase: React.FC<ProductProps> = ({ product, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 text-white p-8 rounded-md w-1/3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-60 object-cover mb-4 rounded-md"
        />
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>
        <p className="mb-2">Minting: {product.minting}</p>
        <p className="mb-4">Price: {product.price}</p>
        <button
          className="bg-blue-600 py-2 px-4 rounded-md"
          onClick={() => alert(`Buying ${product.name}`)}
        >
          Buy
        </button>
        <button
          className="ml-4 text-red-500"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProductShowcase;
