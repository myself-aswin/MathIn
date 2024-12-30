// firebase0.js

import { db } from "../../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export async function FirebaseTestSetup(email, name) {
  const userEntry = doc(collection(db, "userEntries"), `${email}`);
  const currentDate = new Date();

  try {
    const userEntryDoc = await getDoc(userEntry);

    if (userEntryDoc.exists()) {
      const data = userEntryDoc.data();
      const lastEntryDate = data.lastEntry
        ? data.lastEntry.toDate()
        : new Date();
      const timeDifference = currentDate - lastEntryDate;
      const hoursDifference = timeDifference / (1000 * 60 * 60);

      if (hoursDifference >= 24) {
        await updateDoc(userEntry, {
          name: name,
          count: 1,
          lastEntry: serverTimestamp(),
        });
        return { allowed: true, message: "First attempt after reset." };
      } else if (data.count >= 2) {
        return {
          allowed: false,
          message:
            "Only 2 attempts are allowed per day. Try again after 24 hours !",
        };
      } else {
        await updateDoc(userEntry, {
          name: name,
          count: data.count + 1,
          lastEntry: serverTimestamp(),
        });
        return { allowed: true, message: "Attempt allowed." };
      }
    } else {
      await setDoc(userEntry, {
        name: name,
        email: email,
        count: 1,
        test: "Failed",
        lastEntry: serverTimestamp(),
      });
      return { allowed: true, message: "New user entry created." };
    }
  } catch (e) {
    console.error("Error updating userEntry: ", e);
    return {
      allowed: false,
      message: "Error connecting to server. Please try again !",
    };
  }
}