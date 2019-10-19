import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBdv3aQJFSQ2YrqrWDBMcgWChxRpXFJQ-c",
    authDomain: "crown-db-afea4.firebaseapp.com",
    databaseURL: "https://crown-db-afea4.firebaseio.com",
    projectId: "crown-db-afea4",
    storageBucket: "crown-db-afea4.appspot.com",
    messagingSenderId: "301640865910",
    appId: "1:301640865910:web:0becf15f76a1dbf90fa757",
    measurementId: "G-QWCEGHHZ79"
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

    if (!snapShot.exists) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log('error creating user', error.message);
        }
    }

    return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Code below ensures Google authentication pops up when user needs to authenticate
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account'}); 

export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;