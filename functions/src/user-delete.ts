/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const userDelete =
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


export const systemUserDeleteCreate =
  functions.database.ref('system/users/onDelete/{key}').onCreate(async (snapshot) => {
    setTimeout(() => {
      snapshot.ref.remove();
    }, 5000);
  });

