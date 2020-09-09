// Create empty variable for the JSON data to be used later to reduce down the API calls.
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
    });

// Function to build the table with information from the JSON information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(data) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

    data.forEach(function(subject){
        tableBuild += '<td data-title = "ID"><br>'
        + subject.studentID
        + '<hr></td><td data-title = "Name"><br>'
        + subject.studentName
        + '<hr></td><td data-title = "Date"><br>'
        + subject.dateTime
        + '<hr></td><td data-title = "Subject"><br>'
        + subject.subjectName
        + '<hr></td><td data-title = "Attendance"><br>'
        + subject.attendanceRating
        + '<hr></td><td data-title = "Attendance Comment"><br>'
        + subject.attendanceComment
        + '<hr></td><td data-title = "Attitude"><br>'
        + subject.attitudeRating
        + '<hr></td><td data-title = "Attitude Comment"><br>'
        + subject.attitudeComment
        + '<hr></td><td data-title = "Additional Comment"><br>'
        + subject.additionalComments
        + '<hr></td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
    });
}