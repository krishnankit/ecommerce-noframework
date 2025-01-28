import React from "react";
import { FaRupeeSign } from "react-icons/fa";

function CartSummary({ cartItems }) {
  let grandTotal = cartItems.reduce((total, item) => {
    total += (item.cartQuantity * item.price);
    return total;
  }, 0);

  return (
    <>
      <div className="flex justify-between text-slate-800 border-b-4 mb-3 border-indigo-500 text-2xl font-bold">
        <h1>Your Total:</h1>
        <h1><FaRupeeSign className="inline" />{grandTotal}</h1>
      </div>
      {
        cartItems.map(cartItem => {
          return (
            <div key={cartItem.id} className="grid grid-cols-[4fr_1fr] p-2 mb-2 shadow-sm text-slate-800">
              <p>{cartItem.title}</p>
              <p>
                <FaRupeeSign className="inline text-sm" />{cartItem.price * cartItem.cartQuantity}
                <span className="text-sm text-slate-500 block">
                  ({`${cartItem.price} x ${cartItem.cartQuantity}`})
                </span>
              </p>
            </div>
          );
        })
      }
    </>
  );
}

export default CartSummary;
