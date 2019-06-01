/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/6.1.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.1.0/firebase-messaging.js");

const firebaseConfig = {
     apiKey: "AIzaSyA5wmkeprSB0oa4eWzNYOnGu9MpnE9xCss",
     authDomain: "igk-demo.firebaseapp.com",
     databaseURL: "https://igk-demo.firebaseio.com",
     projectId: "igk-demo",
     storageBucket: "igk-demo.appspot.com",
     messagingSenderId: "870797211016",
     appId: "1:870797211016:web:ffc45833d665834f",
};

firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line no-unused-vars
const messaging = firebase.messaging();
