import firebase from 'firebase/app';
import 'firebase/auth';
import Constants from 'expo-constants';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDHnq37Wszx7hBMBiMDD5grN3VChZ7Q7Hw",
  authDomain: "nowaste-9ddd0.firebaseapp.com",
  databaseURL: "https://nowaste-9ddd0-default-rtdb.firebaseio.com",
  projectId: "nowaste-9ddd0",
  storageBucket: "nowaste-9ddd0.appspot.com",
  messagingSenderId: "678683026925",
  appId: "1:678683026925:web:df3709ca219817a2e3f3e4",
  measurementId: "G-4XZY64H547"
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
}

export default Firebase;
