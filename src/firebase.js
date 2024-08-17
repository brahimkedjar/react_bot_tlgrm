// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlRQ6LDZQRzJ1lhGJV7tPuQE8hZIaBkSQ",
    authDomain: "scriptvfs.firebaseapp.com",
    databaseURL: "https://scriptvfs-default-rtdb.firebaseio.com",
    projectId: "scriptvfs",
    storageBucket: "scriptvfs.appspot.com",
    messagingSenderId: "560062615085",
    appId: "1:560062615085:web:d924d5f697a14d76cdf2a4",
    measurementId: "G-LDM0THXZHX"
 
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
