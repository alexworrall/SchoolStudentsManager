/* // Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData = [];

// Get the JSON from Firebase using the URL
var url = 'https://schoolstudentmanager.firebaseio.com/feedback.json';
// Get the information from the firebase rest service in JSON
fetch(url)
    .then(function(data) {
        return data.json()
    })
    .then(function(data) {
        // Grab the lecturer information from the JSON and show in the dropdown box.
        jsonData = data;
        // Create an array to hold all the feedback from firebase
        var feedbackArray = [];

        // Loop through the registrations and grab the subjects enrolled.
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            // Loop through the subjects and gather the lecturers.
            Object.keys(value).forEach(function(key) {
                var subjectValue = value[key];
                // Add the feedback to the end of the array
                feedbackArray.push(subjectValue);
            });
        });

        createRow(feedbackArray);
    }); */

// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

var db = firebase.firestore();

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var subjects = db.collectionGroup('feedback');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        // Add the feedback item to the table
        //lecturerArray.push(doc.data().lecturer);
        createRow(doc.data());
    });
    
});

// Function to build the table with information from the JSON information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(data) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

    //data.forEach(function(subject){
        tableBuild += '<p class="studentHeading">Feedback for student: ' + data.studentName + '</p><td data-title = "ID"><br>'
        + data.studentID
        + '</td><td data-title = "Name"><br>'
        + data.studentName
        + '</td><td data-title = "Date"><br>'
        + data.dateTime
        + '</td><td data-title = "Subject"><br>'
        + data.subjectName
        + '</td><td data-title = "Attendance"><br>'
        + data.attendanceRating
        + '</td><td data-title = "Attendance Comment"><br>'
        + data.attendanceComment
        + '</td><td data-title = "Attitude"><br>'
        + data.attitudeRating
        + '</td><td data-title = "Attitude Comment"><br>'
        + data.attitudeComment
        + '</td><td data-title = "Additional Comment"><br>'
        + data.additionalComments
        + '</td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
   // });
}