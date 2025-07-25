// firebaseConfig.js
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDJHy2z0uKQCm6OxqqNdIzjVhm35r8UVhs",
    authDomain: "inquoto.firebaseapp.com",
    databaseURL: "https://inquoto-default-rtdb.firebaseio.com",
    projectId: "inquoto",
    storageBucket: "inquoto.firebasestorage.app",
    messagingSenderId: "266037986394",
    appId: "1:266037986394:web:7786e0a85353f55c030463",
    measurementId: "G-LQ9CKN2XNS"
  };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();  // If already initialized
}

export default firebase;
