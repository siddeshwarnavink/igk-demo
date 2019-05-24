import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

export default firebase;

