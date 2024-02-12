import { initializeApp } from "firebase-admin/app";
import { firestore } from "firebase-admin";
import { CollectionName, OpapDrawV3 } from "../../../shared/data-types";

/** Initialize Firebase */
initializeApp();

/** Firestore instance & settings */
export const db = firestore();
db.settings({ ignoreUndefinedProperties: true });

/** Available collections */
export const collectionRef = <T>(collectionName: CollectionName) => db.collection(collectionName) as firestore.CollectionReference<T>;
export const collection_OpapDrawV3 = collectionRef<OpapDrawV3>(CollectionName.OpapDrawV3);
