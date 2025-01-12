import { fireDB } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

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

export { checkAdmin, capitalize, getUserIdAndName };
