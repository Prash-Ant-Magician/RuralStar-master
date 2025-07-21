
import { 
    auth,
    db
} from './config';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider,
    signOut,
    updateProfile,
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink
} from 'firebase/auth';
import { doc, setDoc, getDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

const actionCodeSettings = {
    url: process.env.NODE_ENV === 'production' 
        ? 'https://ruralstar.web.app/login' 
        : 'http://localhost:9002/login',
    handleCodeInApp: true,
};


export async function sendSignInLink(email: string) {
    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    } catch (error) {
        console.error("Error sending sign in link", error);
        throw error;
    }
}

export function isSignInLink(url: string) {
    return isSignInWithEmailLink(auth, url);
}

export async function signInWithLink(email: string, url: string) {
    try {
        const { user } = await signInWithEmailLink(auth, email, url);
        
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
             await setDoc(userDocRef, {
                uid: user.uid,
                displayName: user.displayName || email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }
        return user;
    } catch(error) {
        console.error("Error signing in with email link", error);
        throw error;
    }
}


export async function signUpWithEmail(email: string, password: string, displayName: string) {
    try {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName });
        
        // Create a user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            displayName,
            email,
            photoURL: user.photoURL,
            createdAt: new Date(),
        });

        return user;
    } catch (error) {
        console.error("Error signing up with email and password", error);
        throw error;
    }
}


export async function signInWithEmail(email: string, password: string) {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return user;
    } catch (error) {
        console.error("Error signing in with email and password", error);
        throw error;
    }
}

export async function signInWithGoogle() {
    try {
        const { user } = await signInWithPopup(auth, googleProvider);
        
        // Check if user already exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // If user doesn't exist, create a new document
        if (!userDoc.exists()) {
             await setDoc(userDocRef, {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                createdAt: new Date(),
            });
        }

        return user;
    } catch (error) {
        console.error("Error signing in with Google", error);
        throw error;
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
        throw error;
    }
}
