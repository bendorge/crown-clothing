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

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey);

    const batch = firestore.batch();
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc();
        //console.log(newDocRef);
        batch.set(newDocRef, obj);
    });

    return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollection = collections.docs.map(doc => {
        const { title, items } = doc.data();

        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    });

    return transformedCollection.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection;
        return accumulator;
    }, {})
}

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(userAuth => {
            unsubscribe(); 
            resolve(userAuth);
        }, reject);
    });
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

// Code below ensures Google authentication pops up when user needs to authenticate
export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account'}); 

export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;