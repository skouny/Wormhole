import { initializeApp } from "firebase-admin/app";
import { firestore } from "firebase-admin";
import { CollectionName, OpapDrawV3 } from "../../../shared/data-types";
/** Initialize Firebase */
initializeApp();
/** Firestore instance & settings */
export const db = firestore();
db.settings({ ignoreUndefinedProperties: true });
/** */
export const collectionRef = <T>(collectionName: CollectionName) => db.collection(collectionName) as firestore.CollectionReference<T>;
/** */
export const documentUID = <T>(snapshot: firestore.DocumentSnapshot<T> | firestore.QueryDocumentSnapshot<T>) => {
  const data = snapshot.data();
  if (!snapshot.exists) return;
  if (data === undefined) return;
  return { ...data, UID: snapshot.id };
};
// #region Available collections
export const collection_OpapDrawV3 = collectionRef<OpapDrawV3>(CollectionName.OpapDrawV3);
// #endregion
