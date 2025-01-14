import React from "react";
import { FaRupeeSign } from "react-icons/fa";

function CartSummary({ cartItems }) {
  let grandTotal = cartItems.reduce((total, item) => {
    total += (item.cartQuantity * item.price);
    return total;
  }, 0);

  return (
    <>
      <div className="flex justify-between text-primary border-b-4 mb-3 border-secondary text-2xl font-bold">
        <h1>Your Total:</h1>
        <h1><FaRupeeSign className="inline" />{grandTotal}</h1>
      </div>
      {
        cartItems.map(cartItem => {
          return (
            <div key={cartItem.id} className="grid grid-cols-[4fr_1fr] border-b-2 border-secondary p-2">
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
    </>
  );
}

export default CartSummary;
