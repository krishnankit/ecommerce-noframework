import React, { useContext } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { globalContext } from "../context/globalState";
import { useNavigate } from "react-router";
import { fireDB } from "../../firebaseConfig";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";

function ProductCard({ product }) {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);
  const navigate = useNavigate();

  function handleBuy(productId) {
    alert("Product bought");
  }

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
    <div className="pt-3 pb-5 px-3 border border-2 border-secondary rounded">
      <div className=" flex items-center">
        <img
          className="w-[60%] aspect-square"
          src={product.imageURL}
          alt={product.title}
        />
        <p className="w-[40%] text-center text-3xl font-bold">
          <FaRupeeSign className="inline text-base" />
          {product.price}
        </p>
      </div>
      <h1 className="mt-2">{product.title}</h1>
      <div className="flex justify-center mt-4 gap-3">
        <button
          className="w-[full] px-4 py-2 rounded cusor-pointer text-white bg-primary hover:text-primary hover:bg-white hover:border hover:border-primary transition delay-100"
          onClick={() => handleBuy(product.id)}
        >
          Buy
        </button>
        <button
          className="w-[full] px-4 py-2 border border-secondary rounded text-secondary cusor-pointer hover:text-white hover:bg-secondary transition delay-100"
          onClick={() => {handleAddToCart(product.id)}}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
