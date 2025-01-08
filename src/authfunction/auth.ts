import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebaseauth/firebase';

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.error('Google Sign-In Error:', error.message);
  }
};

export const signInWithGitHub = async () => {
  try {
    await signInWithPopup(auth, githubProvider);
  } catch (error: any) {
    console.error('GitHub Sign-In Error:', error.message);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Sign-Out Error:', error.message);
  }
};
