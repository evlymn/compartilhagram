
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const writeTimeLineFavorite =
  functions.database.ref('timeline/favorites/messages/{key}/').onWrite(async (change, context) => {
    if (!change.before.exists()) {
      onCreateTimelineFavorite(change.after, context.auth?.uid ?? "0").catch();
    }
    // if ((change.after.exists() && change.before.exists()) &&
    //   change.before.val() !== change.after.val()) {
    //   onUpdateComment(change.before, change.after).catch();
    // }
    if (!change.after.exists()) {
      onDeleteTimelineFavorite(change.before, context.auth?.uid ?? "0").catch();
    }
  });

async function onCreateTimelineFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/favorites/messages/${snapshot.key}/${uid}`;
  return admin.database().ref(`timeline/look-ahead/favorites/timeline/${uid}`).push({
    postId: snapshot.key,
    path,
  });
}

async function onDeleteTimelineFavorite(snapshot: functions.database.DataSnapshot, uid: string) {
  const path =`timeline/look-ahead/favorites/timeline/${uid}`;
  admin.database().ref(path).orderByChild('postId').equalTo(snapshot.key).get().then((users) => {
    users.forEach((posts) => {
      posts.ref.remove().catch();
    });
  });
}
