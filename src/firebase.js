import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/analytics';

var firebaseConfig = {
    apiKey: "AIzaSyATBgR1DftIbaUVHvRsxrXNKq8YMo3Vkz4",
    authDomain: "chato-ede1e.firebaseapp.com",
    databaseURL: "https://chato-ede1e.firebaseio.com",
    projectId: "chato-ede1e",
    storageBucket: "chato-ede1e.appspot.com",
    messagingSenderId: "990391075593",
    appId: "1:990391075593:web:507f315064d0f1486009d8",
    measurementId: "G-EBBD9S40Q9"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;