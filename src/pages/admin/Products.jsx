import React, { useState, useEffect, useContext } from "react";
import { FaEdit, FaEye, FaPen, FaTrash, Fatrash } from "react-icons/fa";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../../firebaseConfig";
import { globalContext } from "../../context/globalState";
import ProductModal from "./ProductModal";

function Products() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [modalProduct, setModalProduct] = useState(null);
  const { displayToast } = useContext(globalContext);

  useEffect(() => {
    getDocs(collection(fireDB, "products"))
    .then(snapshot => {
      snapshot.forEach(doc => {
        setProducts([
          ...products,
          {
            id: doc.id,
            ...doc.data(),
          }
        ]);
      });
    })
    .catch(error => {
      console.error(error);
      displayToast({
        message: "Unable to fetch products",
        type: "error",
      })
    })
  }, []);

  function closeModal() {
    setModalProduct(null);
    setShowModal(false);
  }

  function displayModal({ prod }) {
    setModalProduct(prod);
    setShowModal(true);
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Products</h1>
      <table className="mt-3 mx-auto">
        <colgroup><col /><col /><col /><col /><col /><col /></colgroup>
        <thead>
          <tr>
            <th className="px-3 py-2 border border-2 border-solid">Sr no.</th>
            <th className="px-3 py-2 border border-2 border-solid">Title</th>
            <th className="px-3 py-2 border border-2 border-solid">Price</th>
            <th className="px-3 py-2 border border-2 border-solid">Quantity</th>
            <th colSpan="3" className="px-2 py-1 border border-2 border-solid">Options</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => {
            return (
              <tr key={prod.id} className="hover:bg-tertiary cursor-pointer">
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  {index + 1}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  {prod.title}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  {prod.price}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  {prod.quantity}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  <FaEdit />
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                >
                  <FaTrash />
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-solid"
                  onClick={() => displayModal({ prod })}
                >
                  <FaEye />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {
        showModal && <ProductModal product={modalProduct} onClose={closeModal} />
      }
    </div>
  );
}

export default Products;
