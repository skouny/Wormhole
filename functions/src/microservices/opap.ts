import Axios from "axios";
import { collection_OpapDrawV3 } from "../toolbox/firebase";
import { OpapDrawV3 } from "../../../shared/data-types";
/** */
export const downloadDrawV3 = async (gameId: number, drawId: number) => {
  const url = `https://api.opap.gr/draws/v3.0/${gameId}/${drawId}`;
  return (await Axios.get(url)).data as OpapDrawV3;
};
/** */
export const updateDrawV3 = async (gameId: number, drawId: number): Promise<boolean> => {
  const UID = `${gameId}_${drawId}`;
  const data = await downloadDrawV3(gameId, drawId);
  if (data.status !== "results") {
    return false;
  }
  await collection_OpapDrawV3.doc(UID).set(data);
  return true;
};
/** Update all missing draws starting from a specific drawId */
export const updateDrawsV3 = async (gameId: number, drawId: number, limit = 100) => {
  let count = 0;
  do {
    drawId++;
    const UID = `${gameId}_${drawId}`;
    const ref = collection_OpapDrawV3.doc(UID);
    const doc = await ref.get();
    if (!doc.exists) {
      const result = await updateDrawV3(gameId, drawId);
      if (!result) break;
      count++;
    }
  } while (count < limit);
};
/** Update missing draws starting from the latest available */
export const updateDrawsQuickV3 = async (gameId: number) => {
  const query = await collection_OpapDrawV3.where("drawId", ">=", 0).orderBy("drawId", "desc").limit(1).get();
  if (query.docs.length === 1) {
    const doc = query.docs[0].data();
    await updateDrawsV3(gameId, doc.drawId);
  }
};
