import React, { useContext, useEffect, useState } from "react";
import { collection, doc, documentId, getDocs, getDoc, query, where } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import { globalContext } from "../context/globalState";
import Sidebar from "../components/Sidebar";
import { FaArrowDown, FaArrowUp, FaRupeeSign, FaTrash } from "react-icons/fa";

function Cart() {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

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

  useEffect(() => {
    let grandTotal = cartItems.reduce((total, item) => {
      total += (item.cartQuantity * item.price);
      return total;
    }, 0);

    setGrandTotal(grandTotal);
  }, [cartItems]);

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
    <div className="lg:flex justify-between items-start">
      <div className="lg:w-[73%] text-center mb-[5rem]">
        <div className="flex justify-between text-primary border-b-4 mb-3 border-secondary text-2xl font-bold">
          <h1>Your Kart:</h1>
          <h1>Total items: {cartItems.length}</h1>
        </div>
        {
          cartItems.map(cartItem => {
            return (
              <div key={cartItem.id} className="grid sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_0.2fr] items-center gap-4 border-b-2 py-3 border-secondary">
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
      <div className="lg:w-[25%]">
        <div className="flex justify-between text-primary border-b-4 mb-3 border-secondary text-2xl font-bold">
          <h1>Your Total:</h1>
          <h1><FaRupeeSign className="inline" />{grandTotal}</h1>
        </div>
        {
          cartItems.map(cartItem => {
            return (
              <div className="grid grid-cols-[4fr_1fr] border-b-2 border-secondary p-2">
                <p>{cartItem.title}</p>
                <p>
                  <FaRupeeSign className="inline text-sm" />{cartItem.price * cartItem.cartQuantity}
                  <span className="text-sm text-gray block">
                    ({`${cartItem.price} x ${cartItem.cartQuantity}`})
                  </span>
                </p>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}

export default Cart;
