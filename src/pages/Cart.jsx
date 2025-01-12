import React, { useContext, useEffect, useState } from "react";
import { collection, doc, documentId, getDocs, getDoc, query, where } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import { globalContext } from "../context/globalState";
import Sidebar from "../components/Sidebar";
import { FaArrowDown, FaArrowUp, FaRupeeSign, FaTrash } from "react-icons/fa";

function Cart() {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const userDocRef = doc(fireDB, "users", currentUser.databaseId);
    getDoc(userDocRef)
    .then(snapShot => {
      const cart = snapShot.data().cart;
      const productIds = Object.keys(cart);
      const q = query(
        collection(fireDB, "products"),
        where(documentId(), "in", productIds)
      );

      getDocs(q)
      .then(snapShot => {
        let cartItems = [];
        snapShot.docs.forEach(doc => {
          cartItems.push({
            id: doc.id,
            cartQuantity: cart[doc.id],
            ...doc.data(),
          });
        });
        setCartItems(cartItems);
      })
      .catch(error => {
        displayToast({
          message:"Unable to get products",
          type: "error",
        });
        console.log(error);
      })
    })
    .catch(error => {
      displayToast({
        message: "Unable to fetch cart",
        type: "error",
      });

      console.log(error);
    });
  }, []);

  function modifyQuantity(id, action) {
    let items = [...cartItems];
    let item = items.find(item => item.id === id);
    if (item) {
      if (action === "INCREMENT") {
        item.cartQuantity += 1;
        console.log(item);
      } else if (action === "DECREMENT") {
        item.cartQuantity -= 1;
      } else {
        return
      }

      setCartItems(items);
    }
  }

  function deleteItem(id) {
    const newItems = cartItems.filter(item => item.id != id);
    setCartItems(newItems);
  }

  return (
    <div className="md:flex md:flex-row-reversed justify-between items-start">
      <Sidebar />
      <div className="md:w-[73%] text-center">
        <h1 className="text-left text-primary border-b-4 mb-3 border-secondary text-2xl font-bold">
          Your Kart:
        </h1>
        {
          cartItems.map(cartItem => {
            return (
              <div key={cartItem.id} className="grid sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr] lg:grid-cols-[1fr_1fr_1fr_1fr_0.2fr] items-center gap-4 border-b-2 py-3 border-secondary">
                <img
                  src={cartItem.imageURL}
                  alt={cartItem.id}
                  className="w-[100px] h-[100px]"
                />
                <div>
                  <h1 className="text-left">{cartItem.title}</h1>
                </div>
                <div>
                <p className="text-center text-2xl font-medium">
                  <FaRupeeSign className="inline text-base" />
                  {cartItem.price}
                </p>
                </div>
                <div>
                  <button
                    className="py-1 px-2 rounded bg-secondary text-white shadow-bottom-right-sm shadow-primary active:shadow-none active:translate-x-[2px] active:translate-y-[4px] transition duration-75 cursor-pointer"
                    onClick={() =>{
                      if (cartItem.quantity > cartItem.cartQuantity) {
                        modifyQuantity(cartItem.id, "INCREMENT")
                      } else {
                        displayToast({
                          message: "No more stock left",
                          type: "info",
                        });
                      }
                    }}
                  >
                    <FaArrowUp />
                  </button>
                  <p className="inline-block mx-2 w-[2rem]">{cartItem.cartQuantity}</p>
                  <button
                    className="py-1 px-2 rounded bg-secondary text-white shadow-bottom-right-sm shadow-primary active:shadow-none active:translate-x-[2px] active:translate-y-[4px] transition duration-75 cursor-pointer"
                    onClick={() => {
                      if (cartItem.cartQuantity > 1) {
                        modifyQuantity(cartItem.id, "DECREMENT")
                      } else {
                        displayToast({
                          message: "Minimum 1 piece required",
                          type: "info",
                        })
                      }
                    }}
                  >
                    <FaArrowDown />
                  </button>
                </div>
                <div>
                  <button
                      className="py-1 px-2 ml-4 rounded bg-white border border-red text-red shadow-bottom-right-sm shadow-red active:shadow-none active:translate-x-[2px] active:translate-y-[4px] transition duration-75 cursor-pointer"
                      onClick={() => deleteItem(cartItem.id)}
                    >
                      <FaTrash />
                    </button>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default Cart;
