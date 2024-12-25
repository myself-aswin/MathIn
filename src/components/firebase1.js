// firebase1.js

import { db } from "../../firebaseConfig";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

export async function FirebaseTestResult1(email) {
  const userEntry = doc(collection(db, "userEntries"), email);

  try {
    const userEntryDoc = await getDoc(userEntry);

    if (userEntryDoc.exists()) {
      await updateDoc(userEntry, {
        test: "Passed",
      });
      return { allowed: true, message: "Test result updated." };
    } else {
      console.log("User data not found !");
    }
  } catch (error) {
    console.error("Error updating userEntry (Pass status): ", error);
    return {
      allowed: false,
      message: "Error connecting to server. Please try again !",
    };
  }
}
