/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 *
 * Start writing functions at https://firebase.google.com/docs/functions/typescript
 */
import { onRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { region } from "../../shared/firebase-config";

// #region Opap
/** Update a specific draw */
export const updateOpapV3 = onCall({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 60,
}, async (request) => {
  const body = request.data as { gameId: number, drawId: number };
  const opap = await import("./microservices/opap");
  const result = await opap.updateDrawV3(body.gameId, body.drawId);
  return {
    data: result,
  };
});
/** Update draws from the latest available */
export const updateOpapQuickV3 = onCall({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 540,
}, async (request) => {
  const body = request.data as { gameId: number };
  const opap = await import("./microservices/opap");
  await opap.updateDrawsQuickV3(body.gameId);
  return {
    data: "OK",
  };
});
/** Update draws from a given drawId with a limit */
export const updateOpapAllV3 = onCall({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 540,
}, async (request) => {
  const body = request.data as { gameId: number, drawId: number };
  const opap = await import("./microservices/opap");
  await opap.updateDrawsV3(body.gameId, body.drawId, 500);
  return {
    data: "OK",
  };
});
/** Testing */
export const updateOpapTest = onRequest({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 540,
}, async (request, response) => {
  try {
    const gameId = parseInt(`${request.body?.gameId || request.query["gameId"]}`);
    const drawId = parseInt(`${request.body?.drawId || request.query["drawId"]}`);
    const opap = await import("./microservices/opap");
    const result = await opap.updateDrawV3(gameId, drawId);
    response.send({
      data: result,
    });
  } catch (e) {
    response.send({
      "error": (e instanceof Error) ? e.message : "unknown",
    });
  }
});
// #endregion
// #region Examples
/** */
export const callExample = onCall({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 60,
}, (request) => {
  logger.info("Hello logs!", { structuredData: true });
  return request.data;
});
/** https://requestexample-z4n2whrlyq-ey.a.run.app */
export const requestExample = onRequest({
  cors: true,
  region: region,
  memory: "256MiB",
  timeoutSeconds: 60,
}, (request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send({
    "message": "Hello from Firebase!",
  });
});
// #endregion
