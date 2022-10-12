/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {systemUserDeleteCreate, userDelete} from "./user-delete";
import {writeTimeLineFavorite} from "./write-timeline-favorite";
import {writeTimeLineCommentFavorite} from "./write-timeline-comment-favorite";
import {writeTimeLineComment} from "./write-timeline-comment";
import {writeTimeline} from "./write-timeline";
// functions.logger.info("Hello logs!", {structuredData: true});
admin.initializeApp(functions.config().firebase);

// TODO: think of a better name for this function
export const onSystemUserDeleteCreate = systemUserDeleteCreate;

export const onAuthUserDelete = userDelete;

export const onWriteTimeLineFavorite = writeTimeLineFavorite;

export const onWriteTimeLineCommentFavorite = writeTimeLineCommentFavorite;

export const onWriteTimeLineComment = writeTimeLineComment;

export const onWriteTimeline = writeTimeline;

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

