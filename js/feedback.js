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

// Get the JSON from Firebase using the URL
var url = 'https://schoolstudentmanager.firebaseio.com/registrations.json';
// Get the information from the firebase rest service in JSON
fetch(url)
    .then(function(data) {
        return data.json()
    })
    .then(function(data) {
        // Grab the lecturer information from the JSON and show in the dropdown box.
        //var list = data['Episodes'];
        var sel = document.getElementById('lecturerName');
        console.log(Object.values(data));
        var lecturerArray = [];

        // Loop through the registrations and grab the subjects enrolled.
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            // Loop through the subjects and gather the lecturers.
            Object.keys(value).forEach(function(key) {
                var subjectValue = value[key];
                //Only add the lecturer to the list IF it is unique to the array. Stops duplicates in the drop down.
                if (!lecturerArray.includes(subjectValue['lecturer'])){
                    // Not duplicate, add to array.
                    lecturerArray.push(subjectValue['lecturer']);
                }
            });
        });

        // Populate the drop down box
        lecturerArray.forEach(function(item, array) {
            // Add those lecturers to the drop down box
            var opt = document.createElement('option');
            opt.innerHTML = item;
            opt.value = item;
            sel.appendChild(opt);
            //console.log(item)
        })
    });


function lecturerChosen(dropDownValue){
    document.getElementById("studentName").disabled=false;
}