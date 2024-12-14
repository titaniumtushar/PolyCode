import React from "react";
import { API_URL } from "../App";

interface ProductProps {
    product: any;
    onClose: () => void;
}

const ProductShowcase: React.FC<ProductProps> = ({ product, onClose }) => {


    const buyProduct = async ()=>{
        let b = {
            id:product._id,
            name:product.storeName,
            url:product.url,
            price:product.price

        }
        console.log(product);

        

        const res = await fetch(`${API_URL}/api/user/buy`,{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                            authorization: `BEARER ${localStorage.getItem(
                                "token"
                            )}`
            },
            body:JSON.stringify(b)
        })

        const data = await res.json();
        console.log(data);
        alert(data.message);

    }
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 text-white p-8 rounded-md w-1/3">
                <img
                    src={product.imgUrl}
                    alt={product.name}
                    className="w-full h-60 object-cover mb-4 rounded-md"
                />
                <h2 className="text-xl font-bold mb-2">{product.storeName}</h2>
                <p className="mb-2">Description : {product.description}</p>
                <p className="mb-4">Price: {product.price}</p>
                <button
                    className="bg-blue-600 py-2 px-4 rounded-md"
                    onClick={() => buyProduct()}
                >
                    Buy
                </button>
                <button className="ml-4 text-red-500" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default ProductShowcase;
