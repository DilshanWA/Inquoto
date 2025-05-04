
var admin = require("firebase-admin");

var serviceAccount = require("../../../Service Account/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://inventrydb-d9b53-default-rtdb.firebaseio.com"
});


module.exports = { admin };
