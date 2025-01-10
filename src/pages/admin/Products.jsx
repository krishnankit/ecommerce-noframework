import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { FaPen, FaEye, FaTrash } from "react-icons/fa";
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
      const fetchedProducts = [];
      snapshot.forEach(doc => {
        fetchedProducts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setProducts(fetchedProducts);
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
      <h1 className="text-2xl font-bold text-primary">Products</h1>
      <table className="mt-3 mx-auto">
        <colgroup><col /><col /><col /><col /><col /><col /></colgroup>
        <thead>
          <tr>
            <th className="px-3 py-2 border border-2 border-primary">Sr no.</th>
            <th className="px-3 py-2 border border-2 border-primary">Title</th>
            <th className="px-3 py-2 border border-2 border-primary">Price</th>
            <th className="px-3 py-2 border border-2 border-primary">Quantity</th>
            <th colSpan="3" className="px-2 py-1 border border-2 border-primary">Options</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => {
            return (
              <tr key={prod.id} className="">
                <td
                  className="px-3 py-2 text-center border border-2 border-primary"
                >
                  {index + 1}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary"
                >
                  {prod.title}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary"
                >
                  {prod.price}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary"
                >
                  {prod.quantity}
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary text-secondary hover:bg-tertiary cursor-pointer"
                >
                  <Link to={`/admin/edit-product/${prod.id}`}><FaPen /></Link>
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary text-red hover:bg-tertiary cursor-pointer"
                >
                  <FaTrash />
                </td>
                <td
                  className="px-3 py-2 text-center border border-2 border-primary hover:bg-tertiary cursor-pointer"
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
