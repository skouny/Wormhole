import { initializeApp } from "firebase-admin/app";
import { firestore } from "firebase-admin";

/** Initialize Firebase */
initializeApp();

/** Firestore instance & settings */
export const db = firestore();
db.settings({ ignoreUndefinedProperties: true });

/** Available collections */
export const collection_OpapDrawV3 = db.collection("OpapDrawV3");
