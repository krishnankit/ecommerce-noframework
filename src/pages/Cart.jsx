import React, { useContext, useEffect, useState } from "react";
import { collection, doc, documentId, getDocs, getDoc, query, where } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import { globalContext } from "../context/globalState";
import { FaArrowDown, FaArrowUp, FaMinus, FaPlus, FaRupeeSign, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router";
import CartSummary from "../components/CartSummary";

function Cart() {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const userDocRef = doc(fireDB, "users", currentUser.databaseId);
    getDoc(userDocRef)
    .then(snapShot => {
      const cart = snapShot.data().cart;
      const productIds = Object.keys(cart);
      if (productIds.length === 0) return;
      const q = query(
        collection(fireDB, "products"),
        where(documentId(), "in", productIds)
      );

      getDocs(q)
      .then(snapShot => {
        let cartItems = [];
        let grandTotal = 0;
        snapShot.docs.forEach(doc => {
          grandTotal += ( cart[doc.id] * doc.data().price );
          cartItems.push({
            id: doc.id,
            cartQuantity: cart[doc.id],
            ...doc.data(),
          });
        });
        setCartItems(cartItems);
        setGrandTotal(grandTotal);
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

  function handleCheckout() {
    cartItems.forEach(item => {
      if (item.cartQuantity > item.quantity) {
        displayToast({
          message: `Inadequate stock for ${item.title}`,
          type: "info",
        });

        return;
      }
    });

    localStorage.setItem("cart", JSON.stringify({
      items: cartItems,
      grandTotal
    }));

    navigate("/checkout");
  }

  return (
    <div className="lg:flex justify-between items-start">
      {
        cartItems.length == 0 ?
        <h1 className="text-2xl font-primary font-bold">Your kart is empty!</h1>
        :
        <>
          <div className="lg:w-[73%] text-center mb-[5rem]">
            <div className="flex justify-between text-primary border-b-4 mb-3 border-indigo-500 text-2xl font-bold">
              <h1>Your Kart:</h1>
              <h1>Total items: {cartItems.length}</h1>
            </div>
            {
              cartItems.map(cartItem => {
                return (
                  <div key={cartItem.id} className="mb-1 grid sm:grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr_0.2fr] items-center gap-4 p-3 shadow-sm">
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
                        className="p-2 bg-gray-50 text-slate-800 rounded shadow-sm"
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
                        <FaMinus />
                      </button>
                      <p className="inline-block mx-2 w-[2rem]">{cartItem.cartQuantity}</p>
                      <button
                        className="p-2 bg-gray-50 text-slate-800 rounded shadow-sm"
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
                        <FaPlus />
                      </button>
                    </div>
                    <div>
                      <button
                        className="p-2 ml-4 rounded bg-white text-red-600 shadow shadow-sm transition duration-200 cursor-pointer hover:text-indigo-500"
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
            <CartSummary cartItems={cartItems} />
            <button
              className="w-full mt-4 py-2 bg-gray-50 text-indigo-500 border border-indigo-500 rounded shadow-sm shadow-indigo-500 hover:opacity-75 active:shadow-none"
              onClick={handleCheckout}
            >
              Proceed to CHECKOUT!
            </button>
          </div>
        </>
      }
    </div>
  );
}

export default Cart;
