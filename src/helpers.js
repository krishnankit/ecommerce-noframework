import { fireDB } from "../firebaseConfig";
import { collection, doc, query, where, getDocs, updateDoc, orderBy, limit, startAfter } from "firebase/firestore";

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1, string.length);
}

async function checkAdmin(uid) {
  try {
    const q = query(collection(fireDB, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const user = querySnapshot.docs[0].data();
      return user.isAdmin;
    } else {
      console.log("No user found with the given UID");
      return false;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

async function getUserIdAndName(uid) {
  try {
    const q = query(collection(fireDB, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const databaseId = querySnapshot.docs[0].id;
      const { name } = querySnapshot.docs[0].data();
      return { databaseId, name };
    } else {
      throw Error("Unable to find User");
    }
  } catch (error) {
    throw Error("Unable to get User");
  }
}

async function destroyUserCart(id) {
  try {
    const docRef = doc(fireDB, "users", id);
    updateDoc(docRef, {
      cart: {},
    });
  } catch (error) {
    console.log(error);
  }
}

function formattedAddress(address) {
  return  `${address.houseName}, ${address.streetName} ${address.city} - ${address.pincode}.`
}

// Used for infinite scrolling
async function fetchProducts(key) {
  let searchQuery = null;
  if (key == null) {
    searchQuery = query(
      collection(fireDB, "products"),
      orderBy("createdAt", "desc"),
      limit(24),
    )
  } else {
    searchQuery = query(
      collection(fireDB, "products"),
      orderBy("createdAt", "desc"),
      startAfter(key),
      limit(12)
    )
  }

  const snapshot =  await getDocs(searchQuery)
  if (snapshot.empty) {
    return { products: [], lastKey }
  }

  const products = [];
  snapshot.docs.forEach(doc => {
    products.push({
      id: doc.id,
      ...doc.data(),
    })
  });

  // To keep track of last fetched prod used in infinite scroll
  const lastKey = products[products.length - 1].createdAt;
  return { products, lastKey }
}

export {
  checkAdmin,
  capitalize,
  getUserIdAndName,
  destroyUserCart,
  formattedAddress,
  fetchProducts,
};
