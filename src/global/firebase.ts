import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
import { USERS } from '../constants/fbCollections';

const firebaseConfig = {
    apiKey: "AIzaSyA5wmkeprSB0oa4eWzNYOnGu9MpnE9xCss",
    authDomain: "igk-demo.firebaseapp.com",
    databaseURL: "https://igk-demo.firebaseio.com",
    projectId: "igk-demo",
    storageBucket: "igk-demo.appspot.com",
    messagingSenderId: "870797211016",
    appId: "1:870797211016:web:ffc45833d665834f"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging()

firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        messaging.requestPermission().then(() => {
            console.log("Have permission");
            return messaging.getToken();
        })
        .then(async (token) => {
            await firebase.firestore()
                .collection(USERS)
                .doc(user.uid)
                .update({
                    notifyToken: token
                });
        })
        .catch(() => {
            console.log("Error occured!");
        });
    }
});

messaging.onMessage(payload => {
    console.log('onMsg:', payload);
})

export default firebase;

