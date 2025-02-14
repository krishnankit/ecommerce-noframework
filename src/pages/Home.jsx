import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router";
import { checkAdmin, fetchProducts } from "../helpers";
import { globalContext } from "../context/globalState";
import Filter from "../components/Filter";

function Home() {
  const { globalState: { currentUser }, displayToast } = useContext(globalContext);

  // If current User is admin navigate to admin dashboard
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

  const [lastKey, setLastKey] = useState(null);
  const [products, setProducts] = useState([]);

  const [filter, setFilter] = useState({
    title: null,
    category: null,
  });

  function handleViewMore() {
    fetchProducts(lastKey)
    .then(result => {
      const { products, lastKey } = result;
      if (products.length == 0) {
        displayToast({
          type: "info",
          message: "No more products",
        });
      } else {
        setProducts(prevProducts => [...prevProducts, ...products]);
        setLastKey(lastKey);
      }
    }).catch(error => {
      console.log(error);
      displayToast({
        type: "error",
        message: "Something went wrong",
      })
    });
  }

  // Fetch first batch of products when home page is loaded
  useEffect(() => {
    fetchProducts(null)
    .then(result => {
      const { products, lastKey } = result;
      setProducts(products);
      setLastKey(lastKey);
    }).catch(error => {
      displayToast({
        type: "error",
        message: "Something went wrong",
      })
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
      <div className="mt-4 text-center">
      <button
        className="px-3 py-2 text-base bg-indigo-500 text-white rounded shadow-sm cursor-pointer transition duration-150 hover:opacity-1/2 active:shadow-none"
        onClick={handleViewMore}
      >View More</button>
      </div>
    </div>
  );
}

export default Home;