import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import { FaMagnifyingGlass } from "react-icons/fa6";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router";
import { checkAdmin } from "../helpers";
import { globalContext } from "../context/globalState";

function Home() {
  const { globalState: { currentUser } } = useContext(globalContext);
  const navigate = useNavigate();
  if (currentUser) {
    checkAdmin(currentUser.uid)
    .then(isAdmin => {
      if (isAdmin) navigate("/admin/products");
    })
    .catch(error => {
      console.log(error);
    })
  }
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const collectionRef = collection(fireDB, "products");
    getDocs(collectionRef)
    .then(snapShot => {
      const products = [];
      snapShot.forEach(doc => {
        products.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setProducts(products);
    })
    .catch(error => {
      displayToast({
        message: "We Ran into problem. Please visit later",
        type: "error",
      });

      console.log(error);
    });
  }, []);

  return (
    <div>
      <div className="max-w-2xl mx-auto mb-4 px-8 py-4 sm:flex sm:items-center sm:gap-8 rounded shadow-sm">
        <div className="w-full mb-4 sm:my-2 flex justify-between">
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Search"
            className="px-2 py-1 outline-none border-b-2 border-gray w-full"
          />
          <button className="outline-none">
            <FaMagnifyingGlass className="inline text-secondary ml-2 hover:text-gray" />
          </button>
        </div>
        <div className="w-full">
          <select
            name="category"
            id="category"
            className="inline-block w-full px-2 py-1 border-2 rounded border-gray outline-none"
            defaultValue=""
          >
            <option value="" disabled>Category</option>
            <option value="clothes">Clothes</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {
          products.map(product => {
            return <ProductCard key={product.id} product={product} />
          })
        }
      </div>
    </div>
  );
}

export default Home;