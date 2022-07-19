/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// functions.logger.info("Hello logs!", {structuredData: true});
admin.initializeApp(functions.config().firebase);

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  admin.database().ref(`users/` + uid).remove().then(() => {
    admin.database().ref(`timeline/messages`).orderByChild('uid').equalTo(uid).get().then((dataSnapshot) => {
      dataSnapshot.forEach((a) => {
        a.ref.remove().then(() => {
          admin.database().ref(`timeline/comments/${a.ref.key}/`).orderByChild('uid').equalTo(uid).get().then((comments) => {
            comments.forEach((c) => {
              c.ref.remove();
            });
          });

          admin.database().ref(`timeline/favorites/comments/${a.ref.key}`).orderByChild('uid').equalTo(uid).get().then((favorites) => {
            favorites.forEach((f) => {
              f.ref.remove();
            });
          });

          admin.database().ref(`timeline/favorites/messages/${a.ref.key}`).orderByChild('uid').equalTo(uid).get().then((favorites) => {
            favorites.forEach((f) => {
              f.ref.remove();
            });
          });


          // const keys = Object.keys(dataSnapshot.val());
          // keys.forEach(k => {
          //   // const comments =  await admin.database().ref(`timeline/comments/${k}`).orderByChild('uid').equalTo(uid).get();
          //   // comments.forEach(c=> {
          //   //   c.ref.remove();
          //   // });
          //   // const favoritesComments = await  admin.database().ref(`timeline/favorites/comments/${k}`).orderByChild('uid').equalTo(uid).get();
          //   // favoritesComments.forEach(f=> {
          //   //   f.ref.remove();
          //   // });
          //   // const favoritesMessages = await  admin.database().ref(`timeline/favorites/messages//${k}`).orderByChild('uid').equalTo(uid).get();
          //   // favoritesMessages.forEach(f=> {
          //   //   f.ref.remove();
          //   // });
          // });
        });
      });
    });
  });
});
// export const onFinalizeObject =
//   functions.storage.bucket().object().onFinalize((object) => {

//     admin.database().ref('timeline/' + object.metadata?.id).update({
//       objectName: object.name,
//       objectId: object.id,
//     });
//   });

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
  denornalizeOnlyImage(snapshot);
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
  denornalizeOnlyImage(snapshotAfter);
}
function denormalizeByUser(snapshot: functions.database.DataSnapshot): void {
  const uid = snapshot.val().uid;
  const path = `timeline/messages_by_user/${uid}/${snapshot.key}`;
  admin.database().ref(path).set(snapshot.val());
}
function denornalizeOnlyImage(snapshot: functions.database.DataSnapshot) {
  const postText = snapshot.val().postText;
  const path = `timeline/messages_only_image/${snapshot.key}`;
  if (postText.trim().length == 0) {
    admin.database().ref(path).set(snapshot.val());
  } else {
    admin.database().ref(path).remove();
  }
}
