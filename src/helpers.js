import { fireDB } from "../firebaseConfig";
import { collection, doc, query, where, getDocs, updateDoc } from "firebase/firestore";

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

export {
  checkAdmin,
  capitalize,
  getUserIdAndName,
  destroyUserCart,
  formattedAddress
};
