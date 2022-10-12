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


export const onWriteTimeLineFavorite =
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

export const onWriteTimeLineCommentFavorite =
  functions.database.ref('timeline/favorites/comments/{postId}/{commentId}/').onWrite(async (change, context) => {
    if (!change.before.exists()) {
      onCreateCommentFavorite(change.after, context.auth?.uid ?? "0").catch();
    }
    // if ((change.after.exists() && change.before.exists()) &&
    //   change.before.val() !== change.after.val()) {
    //   onUpdateComment(change.before, change.after).catch();
    // }
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

async function removeCommentFavoriteLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/favorites/comments/${uid}`;
  admin.database().ref(path).orderByChild('commentId').equalTo(snapshot.key).get().then((users) => {
    users.forEach((comments) => {
      comments.ref.remove().catch();
    });
  });
}

export const onWriteTimeLineComment =
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

async function onDeleteComment(snapshot: functions.database.DataSnapshot, uid: string) {
  removeCommentLookAhead(snapshot, uid).catch();
}

async function removeCommentLookAhead(snapshot: functions.database.DataSnapshot, uid: string) {
  const path = `timeline/look-ahead/comments/${uid}`;
  admin.database().ref(path).orderByChild('commentId').equalTo(snapshot.key).get().then((users) => {
    users.forEach((comments) => {
      comments.ref.remove().catch();
    });
  });
}

async function onUpdateComment(_snapshotBefore: functions.database.DataSnapshot,
                               snapshotAfter: functions.database.DataSnapshot): Promise<void> {
  if (!snapshotAfter.val().bad_word) {
    await replaceBadWordsInReference(snapshotAfter, 'comment');
    return;
  }
}

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
}

async function replaceBadWords(text: string) {
  const dataSnapshot = await admin.database().ref('timeline/bad_words').get();
  const badWords = dataSnapshot.val();
  const re = new RegExp(Object.keys(badWords).join("|"), "gi");
  return text.replace(re, (matched: string) => badWords[matched.toLowerCase()]);
}


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
  const data = JSON.parse(`{ "${fieldText}": "${newText.replace(/"/gi, '')}" , "bad_word": true}`);
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

