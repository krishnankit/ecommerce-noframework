import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { FaPen, FaEye, FaTrash, FaRupeeSign } from "react-icons/fa";
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
      <h1 className="text-2xl font-bold text-slate-800">Products</h1>
      <div>
        {products.map((prod, index) => {
          return (
            <div key={prod.id} className={`grid grid-cols-[1fr_10fr] lg:grid-cols-[1fr_12fr] items-center my-2 ${index % 2 ? "bg-gray-50" : "bg-white"} px-2 shadow-sm`}>
              <p
                className="px-3 py-2 text-center"
              >
                {index + 1}
              </p>
              <div className="md:grid md:grid-cols-[5fr_5fr] lg:grid-cols-[7fr_5fr] items-center">
                <p
                  className="px-3 py-3 text-left md:text-center"
                >
                  {prod.title}
                </p>
                <div className="grid grid-cols-[2fr_3fr]">
                  <div className="grid grid-cols-2">
                    <p
                      className="px-3 py-2 text-center"
                    >
                      <FaRupeeSign className="inline text-sm -mt-1" />{prod.price}
                    </p>
                    <p
                      className="px-3 py-2 text-center"
                    >
                      {prod.quantity}
                    </p>
                  </div>
                  <div className="grid grid-cols-3">
                    <p
                      className="px-3 py-2 text-center hover:text-indigo-500 hover:bg-tertiary cursor-pointer"
                    >
                      <Link to={`/admin/edit-product/${prod.id}`}><FaPen /></Link>
                    </p>
                    <p
                      className="px-3 py-2 text-center hover:text-indigo-500 cursor-pointer"
                      onClick={() => displayModal({ prod })}
                    >
                      <FaEye />
                    </p>
                    <p
                      className="px-3 py-2 text-center text-red-600 cursor-pointer"
                    >
                      <FaTrash />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {
        showModal && <ProductModal product={modalProduct} onClose={closeModal} />
      }
    </div>
  );
}

export default Products;
