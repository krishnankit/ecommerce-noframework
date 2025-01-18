import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import Sidebar from "../components/Sidebar";
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
    <div className="md:flex justify-between items-start">
      <Sidebar />
      <div className="md:w-[73%]  grid grid-cols-2 lg:grid-cols-3 gap-5">
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