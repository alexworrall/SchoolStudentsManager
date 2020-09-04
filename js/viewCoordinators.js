// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData = [];
// Create an object variable to hold the relevant student information that we need. Name and school.
var studentInfo;
var studentInfoArray = [];

// Get the JSON from Firebase using the URL
var url = 'https://schoolstudentmanager.firebaseio.com/students.json';
// Get the information from the firebase rest service in JSON
fetch(url)
    .then(function(data) {
        return data.json();
    })
    .then(function(data) {
        // Grab the student information from the JSON and show in the dropdown box.
        var sel = document.getElementById('studentName');
        var studentArray = [];
        jsonData = data;

        // Create an array of the students details.
        /*var keys = Object.keys(data);
        var studentsArray = keys.map(function(key1) {
            // Add the keys (studentID) to the students Array
            return key1;
          })*/

        // Loop through the students and grab the students details.
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            // Loop through the subjects and gather the students.
            Object.keys(value).forEach(function(key) {
                var studentValue = value[key];
                //Only add the student to the list IF it is unique to the array. Stops duplicates in the drop down.
                if (!studentArray.includes(studentValue['name']) && studentValue['name'] != undefined){
                    // Not duplicate, add to array.
                    studentArray.push(studentValue['name']);
                    // Add the bits we need to the student object
                    studentInfo = {
                        name: studentValue['name'],
                        school: studentValue['school'],
                      };
                      // Add the student name and school object into an array for processing later.
                    studentInfoArray.push(studentInfo);
                }
            });
        });

        // Populate the drop down box
        studentArray.forEach(function(item) {
            // Add those students to the drop down box
            var opt = document.createElement('option');
            opt.innerHTML = item;
            opt.value = item;
            sel.appendChild(opt);
            //console.log(item)
        });
    });

function studentChosen(dropDownValue){

    // When the student drop down changes, check which student was chosen and find the school that they belong to.

    // Hide the help heading now that the user has selected something from the dropdown.
    var headingHide = document.querySelector('.hideHeading');
    headingHide.style.visibility = 'hidden';

    // Get the JSON from Firebase using the URL
    var url = 'https://schoolstudentmanager.firebaseio.com/school.json';
    // Get the information from the firebase rest service in JSON
    fetch(url)
    .then(function(data) {
        return data.json();
    })
    .then(function(data) {
        // Look at the school and grab the coordinators details based on the student chosen from above in the student dropdown.
        var tb = document.querySelector('#table tbody');

        // Search for the students name to find the school details about the student from our object array.
        let studentObj = studentInfoArray.find(o => o.name === dropDownValue);

        // Get the index that the object is at which matches the students school
        let schoolIndex = Object.keys(data).findIndex(o => o === studentObj.school);
        // Retrieve the school information using the index that we retrieved
        var schoolDetails = Object.values(data)[schoolIndex];

        // while tb has children, remove the first one
        while (tb.childNodes.length) {
            tb.removeChild(tb.childNodes[0]);
        }

        // Pass the object through to the function to add it to the HTML table
        createRow(schoolDetails);

    });
}

// Function to build the table with information from the JSON information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(schoolData) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

        tableBuild = '<td data-title = "Name">'
        + schoolData.coordName
        + '</td><td data-title = "School">'
        + schoolData.title
        + '</td><td data-title = "Phone">'
        + schoolData.coordPhone
        + '</td><td data-title = "Email">'
        + schoolData.coordEmail
        + '</td><td data-title = "Address">'
        + schoolData.coordAddress
        + '</td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
}