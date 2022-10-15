/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export async function replaceBadWordsInReference(snapshot: functions.database.DataSnapshot, fieldText: string) {
  const newText = await replaceBadWords(snapshot.val()[fieldText]);
  const data = JSON.parse(`{ "${fieldText}": "${newText.replace(/"/gi, '')}" , "bad_word": true}`);
  await snapshot.ref.update(data);
}

async function replaceBadWords(text: string) {
  const dataSnapshot = await admin.database().ref('timeline/bad_words').get();
  const badWords = dataSnapshot.val();
  const re = new RegExp(Object.keys(badWords).join("|"), "gi");
  return text.replace(re, (matched: string) => badWords[matched.toLowerCase()]);
}
