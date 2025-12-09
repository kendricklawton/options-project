import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}

const firebaseConfig: FirebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY as string || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN as string || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL as string || '',
    projectId: process.env.FIREBASE_PROJECT_ID as string || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET as string || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string || '',
    appId: process.env.FIREBASE_APP_ID as string || '',
    measurementId: process.env.FIREBASE_MEASUREMENT_ID as string || '',
};

let app;
let auth: Auth;
let firestore: Firestore;

try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    // const analytics = getAnalytics(app);
} catch (error) {
    console.error("Firebase initialization error:", error);
}

export { auth, firestore };
