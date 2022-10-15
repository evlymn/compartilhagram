/* eslint-disable indent */
/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/* eslint-disable quotes */
import * as admin from "firebase-admin";

export async function createFavoriteLookAhead(path: string, data: any) {
  return admin.database().ref(path).set(data);
}

export async function removeFavoriteLookAhead(path: string) {
  admin.database().ref(path).remove().catch();
}
