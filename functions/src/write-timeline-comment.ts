/* eslint-disable indent,no-multiple-empty-lines */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {replaceBadWordsInReference} from "./shared/bad-words";
import {removeCommentFavoriteLookAhead} from "./write-timeline-comment-favorite";


export const writeTimeLineComment =
  functions.database.ref('timeline/comments/{messageKey}/{commentKey}').onWrite(async (change, context) => {
    if (!change.before.exists()) {
      onCreateComment(change.after, context.auth?.uid ?? "0").catch();
    }
    if ((change.after.exists() && change.before.exists()) &&
      change.before.val() !== change.after.val()) {
      onUpdateComment(change.before, change.after).catch();
    }
    if (!change.after.exists()) {
      onDeleteComment(change.before, context.auth?.uid ?? "0").catch();
    }
  });

async function onCreateComment(snapshot: functions.database.DataSnapshot, uid: string) {
  replaceBadWordsInReference(snapshot, 'comment').catch();
  createCommentLookAhead(snapshot, uid).catch();
}

async function createCommentLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/comments/${snapshot.ref.parent?.key}/${snapshot.key}`;
  admin.database().ref(`timeline/look-ahead/comments/${uid}`).push({
    postId: snapshot.ref.parent?.key,
    commentId: snapshot.key,
    path,
  });
}

async function onUpdateComment(_snapshotBefore: functions.database.DataSnapshot,
                               snapshotAfter: functions.database.DataSnapshot): Promise<void> {
  if (!snapshotAfter.val().bad_word) {
    await replaceBadWordsInReference(snapshotAfter, 'comment');
    return;
  }
}

async function onDeleteComment(snapshot: functions.database.DataSnapshot, uid: string) {
  admin.database().ref(`timeline/favorites/comments/${snapshot.ref.parent?.key}/${snapshot.key}`).remove().then(() => {
    removeCommentLookAhead(snapshot, uid).catch();
  });
}

async function removeCommentLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/comments/${uid}`;
  admin.database().ref(path).orderByChild('commentId').equalTo(snapshot.key).get().then((users) => {
    users.forEach((comments) => {
      comments.ref.remove().catch();
    });
  });
  removeCommentFavoriteLookAhead(snapshot, uid).catch();
}



