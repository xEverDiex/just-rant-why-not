import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBHiOTvPBtkOmDUanWFX5hKP7VjgkyLzro",
  authDomain: "bsit3adebug.firebaseapp.com",
  projectId: "bsit3adebug",
  storageBucket: "bsit3adebug.appspot.com",
  messagingSenderId: "585015119742",
  appId: "1:585015119742:web:72089d4e70d2aee6f8ed2f",
  measurementId: "G-2FCT1545T5",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics(); 


export { firebase as default };
