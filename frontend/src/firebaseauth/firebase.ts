import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCejMqB4jrAdhNOXinX1jyVq-4P9gnNmbw",
  authDomain: "bond-63aa9.firebaseapp.com",
  projectId: "bond-63aa9",
  storageBucket: "bond-63aa9.appspot.com", // Ensure this has the correct domain
  messagingSenderId: "1082357764959",
  appId: "1:1082357764959:web:4a27f62a20e9a69d049cea",
  measurementId: "G-5G45YKHJFY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Auth instance
export const auth = getAuth(app);
