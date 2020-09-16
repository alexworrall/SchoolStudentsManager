// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

var db = firebase.firestore();
// Grab the lecturer information from the JSON and show in the dropdown box.
//var list = data['Episodes'];
var sel = document.getElementById('lecturerName');
var lecturerArray = [];

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var subjects = db.collectionGroup('subjects');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        console.log(doc.id, ' => ', doc.data());
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
    document.getElementById("studentName").disabled=false;

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

    var studentsArray = [];
    var students = db.collectionGroup('subjects');
    students.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            const ref = doc.ref;
            const userRef = ref.parent.parent;
            userRef.get().then(parentSnap => {
                const user = parentSnap.data();
                const studentName = user.studentName;
                if (!studentsArray.includes(studentName) && studentName != undefined){
                    // Not duplicate, add to array.
                    studentsArray.push(studentName);
                    // Add those students to the drop down box
                    opt = document.createElement('option');
                    opt.innerHTML = studentName;
                    opt.value = studentName;
                    sel.appendChild(opt);
                }
                
                // Validate the lecturer dropdown now that it has been changed to something.
                validateLecturerDropdown();
            });
        });

    });

    
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