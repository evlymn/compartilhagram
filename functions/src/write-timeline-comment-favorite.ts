/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */

import * as functions from "firebase-functions";
import {createFavoriteLookAhead, removeFavoriteLookAhead} from "./shared/favorites-look-ahead";

export const writeTimeLineCommentFavorite =
  functions.database.ref('timeline/favorites/comments/{postId}/{commentId}/').onWrite(async (change, context) => {
    if (!change.before.exists()) {
      onCreateCommentFavorite(change.after, context.auth?.uid ?? "0").catch();
    }
    if (!change.after.exists()) {
      onDeleteCommentFavorite(change.before, context.auth?.uid ?? "0").catch();
    }
  });

async function onCreateCommentFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  createCommentFavoriteLookAhead(snapshot, uid).catch();
}

async function createCommentFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/favorites/comments/${snapshot.ref.parent?.key}/${snapshot.key}/${uid}`;
  createFavoriteLookAhead(`timeline/look-ahead/favorites/comments/${uid}/${snapshot.key}`, {
    postId: snapshot.ref.parent?.key,
    commentId: snapshot.key,
    path,
  }).catch();
}

async function onDeleteCommentFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  removeCommentFavoriteLookAhead(snapshot, uid).catch();
}

export async function removeCommentFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/favorites/comments/${uid}/${snapshot.key}/`;
  removeFavoriteLookAhead(path).catch();
}
