import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8J5p6NpeAoZQu6u1cLwnQJMD5lez8KoM",
  authDomain: "call-bell-da039.firebaseapp.com",
  projectId: "call-bell-da039",
  storageBucket: "call-bell-da039.appspot.com",
  messagingSenderId: "327137619501",
  appId: "1:327137619501:web:8a7aa1ba8cd7eb9790d2a4",
  measurementId: "G-0ZWDK7YPKY",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
export default db;
