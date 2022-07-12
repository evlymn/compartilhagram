/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// eslint-disable-next-line max-len
export const denormalizePosts = functions.database.ref('timeline/{key}').onCreate(async (snapshot, _) => {
  denormalizeByUser(snapshot);
  denornalizeOnlyImage(snapshot);
});


export const onWriteTimeline =
  functions.database.ref('timeline/{key}').onWrite(async (change) => {
    if (!change.after.exists()) {
      functions.logger.info('delete');
      onCreateTimeline(change.before);
    }
    if (!change.before.exists()) {
      functions.logger.info('create');
      onDeleteTimeline(change.after);
    }
    if ((change.after.exists() && change.before.exists()) &&
      change.before.val() !== change.after.val()) {
      functions.logger.info('update');
      onUpdateTimeline(change.before, change.after);
    }
  });

// eslint-disable-next-line require-jsdoc
function onCreateTimeline(snapshot: functions.database.DataSnapshot) {
  const data = snapshot.val();
}
// eslint-disable-next-line require-jsdoc
function onDeleteTimeline(snapshot: functions.database.DataSnapshot) {
  const data = snapshot.val();
}
// eslint-disable-next-line require-jsdoc
function onUpdateTimeline(
    snapshotBefore: functions.database.DataSnapshot,
    snapshotAfter: functions.database.DataSnapshot): void {
  const beforeData = snapshotBefore.val();
  const afterData = snapshotAfter.val();
}


// eslint-disable-next-line require-jsdoc
function denormalizeByUser(snapshot: functions.database.DataSnapshot): void {
  const uid = snapshot.val().uid;
  // eslint-disable-next-line max-len
  admin.database().ref(`timeline_by_user/${uid}/${snapshot.key}`).set(snapshot.val());
}

// eslint-disable-next-line require-jsdoc
function denornalizeOnlyImage(snapshot: functions.database.DataSnapshot) {
  const postText = snapshot.val().postText;
  if (postText.trim().length == 0) {
    // eslint-disable-next-line max-len
    admin.database().ref(`timeline_only_image/${snapshot.key}`).set(snapshot.val());
  }
}
