import React from "react";
import { FaRupeeSign } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

function ProductModal({ product, onClose }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-transparent flex justify-center items-center">
      <main className="relative w-[70%] h-[80%] py-4 px-8 overflow-auto rounded-md bg-white box-shadow-md" >
        <button
          className="absolute top-2 right-2 text-3xl"
          onClick={onClose}
        >
          <IoClose />
        </button>
        <h1 className="text-xl font-bold text-primary">Product Details</h1>
        <div className="md:flex justify-between mt-4 md:text-left">
          <div className="md:w-[40%] mb-4 border border-bottom">
            <img className="w-[80%] mx-auto" src={product.imageURL} alt={product.title} />
          </div>
          <div className="md:w-[55%] grid grid-cols-2 gap-3">
            <div className="col-span-2 border-b">
              <h2 className="mb-2 text-left text-xl font-bold">
                {product.title}
              </h2>
            </div>
            <div className="border-r">
              <p>Price:</p>
              <h3 className="text-4xl font-extrabold">
                <FaRupeeSign className="inline text-base" />
                {product.price}
              </h3>
            </div>
            <div className="">
              <p>Quantity:</p>
              <h3 className="text-4xl font-extrabold">{product.quantity}</h3>
            </div>
            <div className="border-t col-span-2">
              <h3 className="mt-2 font-bold">Description: </h3>
              <p>{product.description}</p>
            </div>
            <div>
              <p>Category: <strong>{product.category}</strong></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductModal;
