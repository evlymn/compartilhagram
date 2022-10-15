/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */

import * as functions from "firebase-functions";
import {createFavoriteLookAhead, removeFavoriteLookAhead} from "./shared/favorites-look-ahead";

export const writeTimeLineFavorite =
  functions.database.ref('timeline/favorites/messages/{key}/').onWrite(async (change, context) => {
    if (!change.before.exists()) {
      onCreateTimelineFavorite(change.after, context.auth?.uid ?? "0").catch();
    }
    if (!change.after.exists()) {
      onDeleteTimelineFavorite(change.before, context.auth?.uid ?? "0").catch();
    }
  });

async function onCreateTimelineFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  return createTimelineFavoriteLookAhead(snapshot, uid);
}

function createTimelineFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/favorites/messages/${snapshot.key}/${uid}`;
  createFavoriteLookAhead(`timeline/look-ahead/favorites/timeline/${uid}/${snapshot.key}`, {
    postId: snapshot.key,
    path,
  }).catch();
}

async function onDeleteTimelineFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  removeTimelineFavoriteLookAhead(snapshot, uid);
}

export function removeTimelineFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/favorites/timeline/${uid}/${snapshot.key}/`;
  removeFavoriteLookAhead(path).catch();

}
