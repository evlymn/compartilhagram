/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// functions.logger.info("Hello logs!", {structuredData: true});
admin.initializeApp(functions.config().firebase);
export const onSystemUserDeleteCreate =
  functions.database.ref('system/users/onDelete/{key}').onCreate(async (snapshot) => {
    setTimeout(() => {
      snapshot.ref.remove();
    }, 5000);
  });
export const onUserDelete =
  functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  await admin.database().ref(`system/users/onDelete/` + uid).set({
    logout: true,
  });
  admin.database().ref(`users/` + uid).remove().then(async () => {
    admin.database().ref('timeline/messages/').orderByChild('uid').equalTo(uid).get().then(async (posts) => {
      posts.forEach((post) => {
        post.ref.remove();
      });

      const commentsPath = await admin.database().ref('/timeline/look-ahead/comments/' + uid).get();
      if (commentsPath.exists()) {
        commentsPath.forEach((child) => {
          admin.database().ref(child.val().path).remove();
        });
      }
      await admin.database().ref('/timeline/look-ahead/comments/' + uid).remove();

      const favCommentsPath = await admin.database().ref('/timeline/look-ahead/favorites/comments/' + uid).get();
      if (favCommentsPath.exists()) {
        favCommentsPath.forEach((child) => {
          admin.database().ref(child.val().path).remove();
        });
      }
      await admin.database().ref('/timeline/look-ahead/favorites/comments/' + uid).remove();

      const favTimelinePath = await admin.database().ref('/timeline/look-ahead/favorites/timeline/' + uid).get();
      if (favTimelinePath.exists()) {
        favTimelinePath.forEach((child) => {
          admin.database().ref(child.val().path).remove();
        });
      }
      await admin.database().ref('/timeline/look-ahead/favorites/timeline/' + uid).remove();
    });
  });
});

export const onWriteTimeline =
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
      onUpdateTimeline(change.before, change.after);
    }
  });

function onCreateTimeline(snapshot: functions.database.DataSnapshot) {
  denormalizeByUser(snapshot);
  denormalizeOnlyImage(snapshot);
}

function onDeleteTimeline(snapshot: functions.database.DataSnapshot) {
  const data = snapshot.val();
  admin.database().ref(`timeline/messages_by_user/${data.uid}/${snapshot.key}`).remove();
  admin.database().ref(`timeline/messages_only_image/${snapshot.key}`).remove();
  if (data.objectName) {
    admin.storage().bucket().file(data.objectName).delete();
  }
}

function onUpdateTimeline(
  _snapshotBefore: functions.database.DataSnapshot,
  snapshotAfter: functions.database.DataSnapshot): void {
  const afterData = snapshotAfter.val();
  const path = `timeline/messages_by_user/${afterData.uid}/${snapshotAfter.key}`;
  admin.database().ref(path).update(afterData);
  denormalizeOnlyImage(snapshotAfter);
}

function denormalizeByUser(snapshot: functions.database.DataSnapshot): void {
  const uid = snapshot.val().uid;
  const path = `timeline/messages_by_user/${uid}/${snapshot.key}`;
  admin.database().ref(path).set(snapshot.val());
}

function denormalizeOnlyImage(snapshot: functions.database.DataSnapshot) {
  const postText = snapshot.val().postText;
  const path = `timeline/messages_only_image/${snapshot.key}`;
  if (postText.trim().length == 0) {
    admin.database().ref(path).set(snapshot.val());
  } else {
    admin.database().ref(path).remove();
  }
}
