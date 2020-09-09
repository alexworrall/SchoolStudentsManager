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
            var studentID = value.studentID;
            var studentName = value.studentName;
            // Loop through the subjects and gather the lecturers.
            Object.keys(value).forEach(function(key) {
                var subjectValue = value[key];
                // Add the feedback to the end of the array
                feedbackArray.push(subjectValue);
            });
        });
    });

// Function to build the table with information from the JSON information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(data) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

    data.forEach(function(subject){
        tableBuild += '<td data-title = "ID">'
        + subject.studentID
        + '</td><td data-title = "CRN">'
        + subject.CRN
        + '</td><td data-title = "Name">'
        + subject.studentName
        + '</td><td data-title = "Subject">'
        + subject.shortName
        + '</td><td data-title = "Timing">'
        + subject.term
        + '</td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
    });
}