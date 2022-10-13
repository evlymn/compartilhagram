/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import {replaceBadWordsInReference} from "./bad-words";
import * as admin from "firebase-admin";
import {deleteTimelineFavorite} from "./write-timeline-favorite";


export const writeTimeline =
  functions.database.ref('timeline/messages/{key}').onWrite(async (change) => {
    if (!change.after.exists()) {
      functions.logger.info('delete');
      onDeleteTimeline(change.before);
    }
    if (!change.before.exists()) {
      functions.logger.info('create');
      onCreateTimeline(change.after);
    }
    if ((change.after.exists() && change.before.exists()) &&
      change.before.val() !== change.after.val()) {
      functions.logger.info('update');
      onUpdateTimeline(change.before, change.after).catch();
    }
  });

function onCreateTimeline(snapshot: functions.database.DataSnapshot) {
  denormalizeByUser(snapshot);
  denormalizeOnlyImage(snapshot);
  replaceBadWordsInReference(snapshot, 'postText').catch();
}

function onDeleteTimeline(snapshot: functions.database.DataSnapshot) {
  admin.database().ref(`timeline/messages_only_image/${snapshot.key}`).push();
  const data = snapshot.val();
  admin.database().ref(`timeline/messages_by_user/${data.uid}/${snapshot.key}`).remove().then(() => null);
  admin.database().ref(`timeline/messages_only_image/${snapshot.key}`).remove().then(() => null);
  if (data.objectName) {
    admin.storage().bucket().file(data.objectName).delete().then(() => null);
  }
  deleteTimelineFavorite(snapshot, data.uid);
}

async function onUpdateTimeline(
  _snapshotBefore: functions.database.DataSnapshot,
  snapshotAfter: functions.database.DataSnapshot): Promise<void> {
  if (!snapshotAfter.val().bad_word) {
    await replaceBadWordsInReference(snapshotAfter, 'postText');
    return;
  }
  const afterData = snapshotAfter.val();
  const path = `timeline/messages_by_user/${afterData.uid}/${snapshotAfter.key}`;
  admin.database().ref(path).update(afterData).then(() => null);
  denormalizeOnlyImage(snapshotAfter);
}

function denormalizeByUser(snapshot: functions.database.DataSnapshot): void {
  const uid = snapshot.val().uid;
  const path = `timeline/messages_by_user/${uid}/${snapshot.key}`;
  admin.database().ref(path).set(snapshot.val()).then(() => null);
}

function denormalizeOnlyImage(snapshot: functions.database.DataSnapshot) {
  const postText = snapshot.val().postText;
  const path = `timeline/messages_only_image/${snapshot.key}`;
  if (postText.trim().length == 0) {
    admin.database().ref(path).set(snapshot.val()).then(() => null);
  } else {
    admin.database().ref(path).remove().then(() => null);
  }
}
