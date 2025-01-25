import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../firebaseConfig";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router";
import { checkAdmin } from "../helpers";
import { globalContext } from "../context/globalState";
import Filter from "../components/Filter";

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
  const [unfilteredProducts, setUnfilteredProducts] = useState();
  const [products, setProducts] = useState([]);

  const [filter, setFilter] = useState({
    title: null,
    category: null,
  });

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
      setUnfilteredProducts(products);
    })
    .catch(error => {
      displayToast({
        message: "We Ran into problem. Please visit later",
        type: "error",
      });

      console.log(error);
    });
  }, []);

  // Filter the products based on filter value
  useEffect(() => {
    if (filter.title) {
      const products = unfilteredProducts.filter(prod => {
        console.log(prod.title, filter.title);
        return prod.title.toLowerCase().includes(filter.title.toLowerCase())
      });
      setProducts(products);
    }

    if (filter.category) {
      const products = unfilteredProducts.filter(prod => {
        return prod.category.toLowerCase() == filter.category.toLowerCase()
      });
      setProducts(products);
    }
  }, [filter]);

  return (
    <div>
      <Filter setFilter={setFilter} />
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