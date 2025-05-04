

// Backend/firebase.js

const admin = require("firebase-admin");

if (!admin.apps.length) {
  const serviceAccount = require("../config/serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "",
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { db, bucket };


