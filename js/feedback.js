// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

var db = firebase.firestore();
// Grab the lecturer information from the JSON and show in the dropdown box.
//var list = data['Episodes'];
var sel = document.getElementById('lecturerName');
var lecturerArray = [];

var subjects = db.collectionGroup('subjects');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.id, ' => ', doc.data());
        if (!lecturerArray.includes(doc.data().lecturer) && doc.data().lecturer != undefined){
            // Not duplicate, add to array.
            lecturerArray.push(doc.data().lecturer);
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
})


/* // Get all the documents from the students collection
db.collection("registrations").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        doc.ref.collection("subjects").get().then((querySnapshot2) => {
            console.log(querySnapshot2.id, " => ", querySnapshot2.data());
          });
        console.log(doc.id, " => ", doc.data());
        console.log(doc.data().studentID);
    });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
 */
// Get the JSON from Firebase using the URL
//var url = 'https://schoolstudentmanager.firebaseio.com/registrations.json';
// Get the information from the firebase rest service in JSON
/* fetch(url)
    .then(function(data) {
        return data.json()
    })
    .then(function(data) {
        // Grab the lecturer information from the JSON and show in the dropdown box.
        //var list = data['Episodes'];
        var sel = document.getElementById('lecturerName');
        var lecturerArray = [];
        jsonData = data;

        // Create an array of the students details.
        var keys = Object.keys(data);
        var studentsArray = keys.map(function(key1) {
            // Add the keys (studentID) to the students Array
            return key1;
          })

        // Loop through the registrations and grab the subjects enrolled.
        Object.keys(data).forEach(function(key) {
            var value = data[key];
            // Loop through the subjects and gather the lecturers.
            Object.keys(value).forEach(function(key) {
                var subjectValue = value[key];
                //Only add the lecturer to the list IF it is unique to the array. Stops duplicates in the drop down.
                if (!lecturerArray.includes(subjectValue['lecturer']) && subjectValue['lecturer'] != undefined){
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
        })
    }); */


function lecturerChosen(dropDownValue){
    document.getElementById("studentName").disabled=false;

    // Search the JSON data for student details which match the lecturer. Once the lecturer is chosen from the dropdown,
    // check the JSON information for a matching lecturer name in the registrations.

    var studentsArray = [];
    // Loop through the registrations and grab the subjects enrolled.
    Object.keys(jsonData).forEach(function(key) {
        var value = jsonData[key];
        if (!studentsArray.includes(value['studentName']) && value['studentName'] != undefined){
            // Not duplicate, add to array.
            studentsArray.push(value['studentName']);
        }
    });

    var sel = document.getElementById('studentName');
    
    //Remove existing elements in the drop down box to prevent it appending to the end and having a long list
    var i, L = sel.options.length - 1;
    for(i = L; i >= 0; i--) {
        sel.remove(i);
    }

    // Populate the drop down box
    // This does not function as intended yet, I only want to populate this with students that a lecturer has in their subject
    // not all students but for time saving i will show all students and tweak later.
    var opt = document.createElement('option');
    opt.innerHTML = "Select Student";
    opt.value = "";
    sel.appendChild(opt);
    studentsArray.forEach(function(item, array) {
        // Add those students to the drop down box
        opt = document.createElement('option');
        opt.innerHTML = item;
        opt.value = item;
        sel.appendChild(opt);
    })

    // Validate the lecturer dropdown now that it has been changed to something.
    validateLecturerDropdown();
}

function studentChosen(dropDownValue){
    // Validate the student drop down now it has been changed
    validateStudentDropdown();
}

function validateLecturerDropdown(){
    // Check that the lecturer has been selected from the dropdown
    var lecturerDropdown = document.getElementById('lecturerName');
    var lecturerDropdownDiv = document.getElementById('lecturerDropdownDiv');
    if(lecturerDropdown.selectedIndex == 0){  //Test if something was checked
        lecturerDropdownDiv.style.backgroundColor = '#ff9999';
    }else{
        lecturerDropdownDiv.style.backgroundColor = '#6fe99a';
    } 
}

function validateStudentDropdown(){
    // Check that the student has been selected from the dropdown
    var studentDropdown = document.getElementById('studentName');
    var studentDropdownDiv = document.getElementById('studentDropdownDiv');
    if(studentDropdown.selectedIndex == 0){  //Test if something was checked
        studentDropdownDiv.style.backgroundColor = '#ff9999';
    }else{
        studentDropdownDiv.style.backgroundColor = '#6fe99a';
    } 
}

function validateAttendanceRadio(){
    // Check that attendance has been selected
    var checked_attendance = document.querySelector('input[name="radioAttendance"]:checked');
    var attendanceContainer = document.getElementById('attendanceContainer');
    if(checked_attendance == null){  //Test if something was checked
        attendanceContainer.style.backgroundColor = '#ff9999';
    }else{
        attendanceContainer.style.backgroundColor = '#6fe99a';
    } 
}

function validateAttitudeRadio(){
    // Check that attitude has been selected
    var checked_attitude = document.querySelector('input[name="radioAttitude"]:checked');
    var attitudeContainer = document.getElementById('attitudeContainer');
    if(checked_attitude == null){  //Test if something was checked
        attitudeContainer.style.backgroundColor = '#ff9999';
    }else{
        attitudeContainer.style.backgroundColor = '#6fe99a';
    } 
}

var submitFeedbackBtn = document.getElementById('submitFeedbackBtn');

function validateForm(){
    // Check lecturer Dropdown
    validateLecturerDropdown();
    // Check student Dropdown
    validateStudentDropdown();
    // Check attendance radio buttons
    validateAttendanceRadio();
    // Check attitude radio buttons
    validateAttitudeRadio();
}

// Use the event listener to the submit button to send the feedback through firebase.
/*submitFeedbackBtn.addEventListener('click', function(evt) {
    evt.preventDefault();

    // Check lecturer Dropdown
    validateLecturerDropdown();
    // Check student Dropdown
    validateStudentDropdown();
    // Check attendance radio buttons
    validateAttendanceRadio();
    // Check attitude radio buttons
    validateAttitudeRadio();
});*/

// Event listener for the attendance radio buttons
if (document.querySelector('input[name="radioAttendance"]')) {
    document.querySelectorAll('input[name="radioAttendance"]').forEach((elem) => {
      elem.addEventListener("change", function(event) {
        // Validate the attendance radio buttons
        validateAttendanceRadio();
      });
    });
  }

// Event listener for the attitude radio buttons
if (document.querySelector('input[name="radioAttitude"]')) {
    document.querySelectorAll('input[name="radioAttitude"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
        // validate the attitude radio buttons
        validateAttitudeRadio();
        });
    });
}