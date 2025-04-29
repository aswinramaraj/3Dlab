    // Import the functions you need from the SDKs you need
    import { initializeApp } from "firebase/app";
    import { getAnalytics } from "firebase/analytics";
    import { getStorage } from "firebase/storage";
    import { getFirestore } from "firebase/firestore"; 

    const firebaseConfig = {
    apiKey: "AIzaSyBHMBeBKVJ0mopkv1GS-sgQoyFFLHcSGiM",
    authDomain: "community-b3e0b.firebaseapp.com",
    projectId: "community-b3e0b",
    storageBucket: "community-b3e0b.firebasestorage.app",
    messagingSenderId: "340456451428",
    appId: "1:340456451428:web:9dd8bf3c198c6c11e75e71",
    measurementId: "G-VHH26FHDB8"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const imgdb = getStorage(app);
    const textdb = getFirestore(app);

    export {imgdb,textdb};