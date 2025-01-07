// helpers.js
import { fireDB } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

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

export { checkAdmin };
