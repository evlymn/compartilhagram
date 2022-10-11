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

export const onWriteTimeLineComment = functions.database.ref('timeline/comments/{messageKey}/{commentKey}').onWrite(async (change) => {
  if (!change.before.exists()) {
    onCreateComment(change.after).catch();
  }
  if ((change.after.exists() && change.before.exists()) &&
    change.before.val() !== change.after.val()) {
    onUpdateComment(change.before, change.after).catch();
  }
  // if (!change.after.exists()) {
  //   onDeleteTimeline(change.before);
  // }
});

async function onUpdateComment(_snapshotBefore: functions.database.DataSnapshot,
                               snapshotAfter: functions.database.DataSnapshot): Promise<void> {
  if (!snapshotAfter.val().bad_word) {
    await replaceBadWordsInReference(snapshotAfter, 'comment');
    return;
  }
}


async function onCreateComment(snapshot: functions.database.DataSnapshot) {
  replaceBadWordsInReference(snapshot, 'comment').catch();
  // replaceBadWordsInCommentsOnCreate(snapshot).catch();
}
//
// async function replaceBadWordsInCommentsOnCreate(snapshot: functions.database.DataSnapshot) {
//   const newComment = await replaceBadWords(snapshot.val().comment);
//   await admin.database().ref(`timeline/comments/${snapshot.ref.parent?.key}/${snapshot.key}`).update({
//     comment: newComment,
//     bad_word: true,
//   });
// }

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
      onUpdateTimeline(change.before, change.after).catch();
    }
  });

function onCreateTimeline(snapshot: functions.database.DataSnapshot) {
  denormalizeByUser(snapshot);
  denormalizeOnlyImage(snapshot);
  replaceBadWordsInReference(snapshot, 'postText').catch();
  // replaceBadWordsInTimelineOnCreate(snapshot).catch();
}

async function replaceBadWords(text: string) {
  const dataSnapshot = await admin.database().ref('timeline/bad_words').get();
  const badWords = dataSnapshot.val();
  const re = new RegExp(Object.keys(badWords).join("|"), "gi");
  return text.replace(re, (matched: string) => badWords[matched.toLowerCase()]);
}

// async function replaceBadWordsInTimelineOnCreate(snapshot: functions.database.DataSnapshot) {
//   const newPostText = await replaceBadWords(snapshot.val().postText);
//   await admin.database().ref('timeline/messages/' + snapshot.key).update({
//     postText: newPostText,
//     bad_word: true,
//   });
// }

function onDeleteTimeline(snapshot: functions.database.DataSnapshot) {
  admin.database().ref(`timeline/messages_only_image/${snapshot.key}`).push();
  const data = snapshot.val();
  admin.database().ref(`timeline/messages_by_user/${data.uid}/${snapshot.key}`).remove().then(() => null);
  admin.database().ref(`timeline/messages_only_image/${snapshot.key}`).remove().then(() => null);
  if (data.objectName) {
    admin.storage().bucket().file(data.objectName).delete().then(() => null);
  }
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

async function replaceBadWordsInReference(snapshot: functions.database.DataSnapshot, fieldText: string) {
  const newText = await replaceBadWords(snapshot.val()[fieldText]);
  const data = JSON.parse(`{ "${fieldText}": "${newText}" , "bad_word": true}`);
  await snapshot.ref.update(data);
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


export const setBadWord = functions.https.onRequest((req, resp) => {
  admin.database().ref('timeline/messages/').get().then((d) => {
    d.forEach((c) => {
        c.ref.update({
            bad_word: true,
          }
        ).catch();
      }
    );
  });
  resp.end();
});

