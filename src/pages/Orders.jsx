import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { fireDB } from "../../firebaseConfig";
import { globalContext } from "../context/globalState";
import { formattedAddress } from "../helpers";
import { FaRupeeSign } from "react-icons/fa";

function Orders() {
  const {
    globalState: {
      currentUser: {
        databaseId
      }
    },
    displayToast,
  } = useContext(globalContext);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(fireDB, "orders"),
      where("userId", "==", databaseId)
    );

    getDocs(q)
    .then(snapShot => {
      const orders = [];
      snapShot.docs.forEach(doc => {
        const { items, amount, createdAt, address } = doc.data();
        orders.push({
          id: doc.id,
          items,
          address: formattedAddress(address),
          amount,
          createdAt,
        })
      });

      setOrders(orders);
    })
    .catch(error => {
      displayToast({
        message: "Unable to fetch orders",
        type: "error",
      });

      console.log(error);
    })
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold font-primary">
        Your Orders:
      </h1>
      <div className="mt-4">
      {
        orders.length == 0 ?
        <h1 className="text-2xl font-bold font-primary">
          No Orders found
        </h1>
        :
        <>
        <div className="grid grid-cols-[1fr_1fr_2fr_1fr] p-2 font-bold bg-secondary text-white">
          <h1>Placed On</h1>
          <h1>Amount</h1>
          <h1>Deliver to</h1>
          <h1></h1>
        </div>
        {
          orders.map(order => {
            return (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_1fr_2fr_1fr] items-center border-b-2 border-secondary p-2 text-sm"
              >
                <p>{order.createdAt.toDate().toLocaleString()}</p>
                <p>
                  <FaRupeeSign className="inline mb-1" />
                  <span className="text-base font-bold">{order.amount}</span>
                </p>
                <p>{order.address}</p>
                {/* <div className="text-center outline-2-red">
                  <button
                    className="shadow-bottom-right-sm shadow-primary bg-secondary text-white px-2 py-1 active:shadow-none active:translate-x-[2px] translate-y-[4px] outline-2-green"
                  >
                    Show Items
                  </button>
                  </div> */}
                  <p
                    className="text-secondary text-center underline underline-offset-4 font-bold cursor-pointer"
                  >
                    Show Items
                  </p>
              </div>
            );
          })
        }
        </>
      }
      </div>
    </>
  );
}

export default Orders;
