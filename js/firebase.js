// My firebase config info
var firebaseConfig = {
    apiKey: "AIzaSyDLsexWrCr0zrReHo3HvkYKiQNWXAVWMKg",
    authDomain: "schoolstudentmanager.firebaseapp.com",
    databaseURL: "https://schoolstudentmanager.firebaseio.com",
    projectId: "schoolstudentmanager",
    storageBucket: "schoolstudentmanager.appspot.com",
    messagingSenderId: "856737157442",
    appId: "1:856737157442:web:ecaaa61f18b94ece7db8db",
    measurementId: "G-GXLFCNHP94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Get a reference to the database service
//var database = firebase.database();
firebase.firestore().enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });