import React, { useContext } from "react";
import { FaRupeeSign, FaShoppingCart } from "react-icons/fa";
import { globalContext } from "../context/globalState";
import { useNavigate } from "react-router";
import { fireDB } from "../../firebaseConfig";
import { doc, updateDoc, getDoc } from "firebase/firestore";

function ProductCard({ product }) {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);
  const navigate = useNavigate();

  async function handleAddToCart(productId) {
    if (currentUser) {
      const userDocRef = doc(fireDB, "users", currentUser.databaseId);
      const snapShot = await getDoc(userDocRef);
      const cart = snapShot.data().cart || {};
      if (cart[productId]) {
        cart[productId] += 1;
      } else {
        cart[productId] = 1;
      }

      updateDoc(userDocRef, "cart", cart)
      .then(() => {
        displayToast({
          message: "Added to cart",
          type: "info"
        })
      })
      .catch(error => {
        displayToast({
          message: "Unable to add to cart",
          type: "error",
        });
        console.error(error);
      })
    } else {
      navigate("/signin");
      displayToast({
        message: "Please Sign In to continue",
        type: "info",
      });
    }
  }

  return (
    <div className="flex flex-col justify-between py-3 px-4 rounded shadow-md">
      <img
        className="w-full aspect-square rounded"
        src={product.imageURL}
        alt={product.title}
      />
      <h1 className="mt-2">{product.title}</h1>
      <div className="w-full flex justify-between items-center">
        <p className="text-3xl font-bold">
          <FaRupeeSign className="inline text-base" />
          {product.price}
        </p>
        <button
          className="px-4 py-2 text-indigo-500 rounded cusor-pointer hover:scale-105 hover:shadow-sm active:shadow-none active:scale-95 transition duration-150"
          onClick={() => {handleAddToCart(product.id)}}
        >
          <FaShoppingCart className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
