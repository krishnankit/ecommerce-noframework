const { fireDB } = require("../firebaseConfig.js")
const { collection, addDoc } = require("firebase/firestore");

// SCRIPT TO ADD DUMMY PRODUCTS

async function fetchFakeProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    const products = await response.json();
    return products;
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
        price: product.price,
        description: product.description,
        imageURL: product.image,
        category: product.category,
        ratings: Math.floor(Math.random() * 6),
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
