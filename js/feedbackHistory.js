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
// Create an array to hold the lecturers to then use for the dropdown and filter
var lecturerArray = [];

var db = firebase.firestore();

var sel = document.getElementById('lecturerName');
        
//Remove existing elements in the drop down box to prevent it appending to the end and having a long list
var i, L = sel.options.length - 1;
for(i = L; i >= 0; i--) {
    sel.remove(i);
}

// Populate the drop down box
var opt = document.createElement('option');
opt.innerHTML = "No Filter";
opt.value = "";
sel.appendChild(opt);

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var subjects = db.collectionGroup('feedback');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        // Create the table with all the feedback previously generated.
        createRow(doc.data());
        // Add the lecturer names to the array to populate the dropdown if they aren't in there already.
        if (!lecturerArray.includes(doc.data().generatedBy) && doc.data().generatedBy != undefined){
            lecturerArray.push(doc.data().generatedBy);
            opt = document.createElement('option');
            opt.innerHTML = doc.data().generatedBy;
            opt.value = doc.data().generatedBy;
            sel.appendChild(opt);
        }
    }); 
});



// This function will use the value from the dropdown to filter the results shown and only have that lecturer.
function filterFeedback(dropDownValue){

    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

    // Clear table
    tableRef.innerHTML = "";

    // If the drop down is set to no filter then return all lecturers like the default.
    if(dropDownValue == ""){
        //Gather the lecturers details from the enrolled subjects to populate the dropdown
        var subjects = db.collectionGroup('feedback');
        subjects.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // Create the table with all the feedback previously generated.
                createRow(doc.data());
            }); 
        });
    }else{
        db.collectionGroup("feedback").where("generatedBy", "==", dropDownValue)
        .orderBy('dateTime', 'desc')
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // Build the feedback history table, now only with the lecturer from the filter
            createRow(doc.data());
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    }
}

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
        + '</td><td data-title = "Feedback Date"><br>'
        + data.dateTime
        + '</td><td data-title = "Generated By"><br>'
        + data.generatedBy
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