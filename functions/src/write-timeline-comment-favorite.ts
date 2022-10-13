/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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
  const path = `timeline/favorites/comments/${snapshot.ref.parent?.key}/${snapshot.key}/${uid}`;
  return admin.database().ref(`timeline/look-ahead/favorites/comments/${uid}`).push({
    postId: snapshot.ref.parent?.key,
    commentId: snapshot.key,
    path,
  });
}

async function onDeleteCommentFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  removeCommentFavoriteLookAhead(snapshot, uid).catch();
}

export async function removeCommentFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/favorites/comments/${uid}`;
  admin.database().ref(path).orderByChild('commentId').equalTo(snapshot.key).get().then((users) => {
    if (users.exists()) {
      users.forEach((comments) => {
        if (comments.exists()) {
          comments.ref.remove().catch();
        }
      });
    }
  });
}
