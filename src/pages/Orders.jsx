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

      orders.sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1;
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
          orders.map((order, index) => {
            return (
              <div
                key={order.id}
                className="grid grid-cols-[1fr_2fr_2fr_4fr_2fr] my-2 items-center p-2 text-sm shadow-sm hover:opacity-75"
              >
                <p>{index + 1}</p>
                <p>{order.createdAt.toDate().toLocaleString()}</p>
                <p>
                  <FaRupeeSign className="inline mb-1" />
                  <span className="text-base font-bold">{order.amount}</span>
                </p>
                <p>{order.address}</p>
                  <p
                    className="text-indigo-500 text-center underline underline-offset-4 font-bold cursor-pointer"
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
