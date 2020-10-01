// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

var db = firebase.firestore();
// Grab the lecturer information from the JSON and show in the dropdown box.
//var list = data['Episodes'];
var sel = document.getElementById('lecturerName');
var lecturerArray = [];
// Array to hold all the subjects for the chosen student
var subjectArray = [];

// variable to hold the status of the table and whether a row is selected or not
var subjectSelected = false;

// Variable to hold the selected subject from the table
var subjectSelectedFromTable = "";

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var subjects = db.collectionGroup('subjects');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        //console.log(doc.id, ' => ', doc.data());
        if (!lecturerArray.includes(doc.data().lecturer) && doc.data().lecturer != undefined){
            // Not duplicate, add to array.
            lecturerArray.push(doc.data().lecturer);
        }
    });
    
    // Populate the drop down box
    lecturerArray.forEach(function(item, array) {
        // Add those lecturers to the drop down box
        var opt = document.createElement('option');
        opt.innerHTML = item;
        opt.value = item;
        sel.appendChild(opt);
    })
});


function lecturerChosen(dropDownValue){

    // Search the JSON data for student details which match the lecturer. Once the lecturer is chosen from the dropdown,
    // check the JSON information for a matching lecturer name in the registrations.

    // Hide the help heading now that the user has selected something from the dropdown.
    var headingHide = document.querySelector('.hideHeading');
    headingHide.style.display = 'none';


    // Create an array to hold the students found and their subjects for the lecturer chosen
    /* var studentsArray = [];

    // Loop through the registrations and grab the subjects enrolled.
    Object.keys(jsonData).forEach(function(key) {
        var value = jsonData[key];
        // Loop through the subjects and search for the lecturers
        Object.keys(value).forEach(function(key) {
            var subjectValue = value[key];
            //Only add the student and their subjects IF the lecturer shows in their subject list as a lecturer
            if (subjectValue['lecturer'] == dropDownValue){
                // Add the students ID to the JSON object
                subjectValue.studentID = value.studentID;
                // Add the students Name to the JSON object
                subjectValue.studentName = value.studentName;
                // The lecturer has the student in their class so add them to the array
                studentsArray.push(subjectValue);
            }
        });
    }); */

    var studentsArray = [];
    db.collectionGroup("subjects").where("lecturer", "==", dropDownValue)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data(), doc.data().studentName);
            if (!studentsArray.includes(doc.data().studentName) && doc.data().studentName != undefined){
                // Not duplicate, add to array.
                studentsArray.push(doc.data());
            }
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
    var tb = document.querySelector('#table tbody');

    // while tb has children, remove the first one
    while (tb.childNodes.length) {
        tb.removeChild(tb.childNodes[0]);
    }

    createRow(studentsArray);

}

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