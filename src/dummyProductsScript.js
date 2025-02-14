import { fireDB } from "./firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// SCRIPT TO ADD DUMMY PRODUCTS

async function fetchFakeProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.log(error);
  }
}

async function addProductsToFirestore() {
  const products = await fetchFakeProducts();

  if (!products) return;

  const productsCollectionRef = collection(fireDB, "products");

  try {
    let count = 0;
    for (let product of products) {
      const docRef = await addDoc(productsCollectionRef, {
        title: product.title,
        price: Math.round(product.price * 20),
        description: product.description,
        imageURL: product.images[0],
        category: product.category,
        ratings: product.rating,
        createdAt: Date.now(),
      });

      count++;
      console.log("product added with id: ", docRef.id);
    }

    console.log("Total products added: ", count);
  } catch (error) {
    console.log(error);
  }
}

addProductsToFirestore();
