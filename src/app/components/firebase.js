// Import necessary Firebase functions
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBxvDPMWivyt65pzXU4OimCTHrLX0O0-ws",
    authDomain: "ecommerce-c72af.firebaseapp.com",
    projectId: "ecommerce-c72af",
    storageBucket: "ecommerce-c72af.firebasestorage.app",
    messagingSenderId: "895719588422",
    appId: "1:895719588422:web:40f0eaf0c41226b5520047",
    measurementId: "G-X4VRBYPM1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Set up Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };


