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

    // Make the student drop down disabled while the firebase query works
    document.getElementById("studentName").disabled=true;
    var sel = document.getElementById('studentName');
        
    //Remove existing elements in the drop down box to prevent it appending to the end and having a long list
    var i, L = sel.options.length - 1;
    for(i = L; i >= 0; i--) {
        sel.remove(i);
    }

    // Populate the drop down box
    var opt = document.createElement('option');
    opt.innerHTML = "Select Student";
    opt.value = "";
    sel.appendChild(opt);

    var studentsArray = [];
    db.collectionGroup("subjects").where("lecturer", "==", dropDownValue)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data(), doc.data().studentName);
            if (!studentsArray.includes(doc.data().studentName) && doc.data().studentName != undefined){
                // Not duplicate, add to array.
                studentsArray.push(doc.data().studentName);
                // Add those students to the drop down box
                opt = document.createElement('option');
                opt.innerHTML = doc.data().studentName;
                opt.value = doc.data().studentName;
                sel.appendChild(opt);
            }
                
                // Validate the lecturer dropdown now that it has been changed to something.
                validateLecturerDropdown();
                document.getElementById("studentName").disabled=false;
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
    
}

function studentChosen(dropDownValue){
    // Validate the student drop down now it has been changed
    validateStudentDropdown();
    clearFormFields();

    // Show the studentID
    document.getElementById('selectedStudentContainer').style.display = 'block';

    subjectArray = [];
    db.collectionGroup("subjects").where("studentName", "==", dropDownValue)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // Not duplicate, add to array.
            subjectArray.push(doc);
            // Add those students to the drop down box

            // Validate the lecturer dropdown now that it has been changed to something.
            validateLecturerDropdown();
            document.getElementById("studentName").disabled=false;
            document.getElementById("selectedStudent").innerHTML = doc.data().studentID;
        });
        // Pass the newly filled subject array to the createrow function which will populate the table
        createRow(subjectArray);
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}

function validateLecturerDropdown(){
    // Check that the lecturer has been selected from the dropdown
    var lecturerDropdown = document.getElementById('lecturerName');
    var lecturerDropdownDiv = document.getElementById('lecturerDropdownDiv');
    if(lecturerDropdown.selectedIndex == 0){  //Test if something was checked
        lecturerDropdownDiv.style.backgroundColor = '#ff9999';
        return false;
    }else{
        lecturerDropdownDiv.style.backgroundColor = '#6fe99a';
        return true;
    } 
}

function validateStudentDropdown(){
    // Check that the student has been selected from the dropdown
    var studentDropdown = document.getElementById('studentName');
    var studentDropdownDiv = document.getElementById('studentDropdownDiv');
    if(studentDropdown.selectedIndex == 0){  //Test if something was checked
        studentDropdownDiv.style.backgroundColor = '#ff9999';
        return false;
    }else{
        studentDropdownDiv.style.backgroundColor = '#6fe99a';
        return true;
    } 
}

function validateAttendanceRadio(){
    // Check that attendance has been selected
    var checked_attendance = document.querySelector('input[name="radioAttendance"]:checked');
    var attendanceContainer = document.getElementById('attendanceContainer');
    if(checked_attendance == null){  //Test if something was checked
        attendanceContainer.style.backgroundColor = '#ff9999';
        return false;
    }else{
        attendanceContainer.style.backgroundColor = '#6fe99a';
        return true;
    } 
}

function validateAttitudeRadio(){
    // Check that attitude has been selected
    var checked_attitude = document.querySelector('input[name="radioAttitude"]:checked');
    var attitudeContainer = document.getElementById('attitudeContainer');
    if(checked_attitude == null){  //Test if something was checked
        attitudeContainer.style.backgroundColor = '#ff9999';
        return false;
    }else{
        attitudeContainer.style.backgroundColor = '#6fe99a';
        return true;
    } 
}

function validateSubjectTable(){
    if(subjectSelected == false){
        document.getElementById('table').style.border = "thick solid Red";
        document.getElementById('subjectSelectorHeading').style.backgroundColor = '#ff9999';
        return false;
    }else{
        return true;
    }
}

function clearFormFields(){
    // Clear the table ready for next student
    document.getElementById('table').style.border = '';
    // Clear the results table background colour
    document.getElementById('subjectSelectorHeading').style.backgroundColor = '';
    // Nothing is selected anymore, set flag
    subjectSelected = false;
}

var submitFeedbackBtn = document.getElementById('submitFeedbackBtn');

function validateForm(){
    // Check lecturer Dropdown
    var lectValid = validateLecturerDropdown();
    // Check student Dropdown
    var studentValid = validateStudentDropdown();
    // Check that a subject is selected
    var subjectValid = validateSubjectTable();
    // Check attendance radio buttons
    var attendanceValid = validateAttendanceRadio();
    // Check attitude radio buttons
    var attitudeValid = validateAttitudeRadio();

    // Be 100% sure that there are no items missing before submitting to firebase
    if (lectValid == false | studentValid == false | subjectValid == false | attendanceValid == false | attitudeValid == false){
        return false;
    }else{
        var d = new Date();
        // Submit items to firebase
        // Add a new document with an auto generated id.
        db.collection("feedback").add({
            studentID: subjectArray[0].data().studentID,
            studentName: subjectArray[0].data().studentName,
            subjectName: subjectSelectedFromTable,
            generatedBy: document.getElementById('lecturerName').value,
            dateTime: firebase.firestore.Timestamp.fromDate(new Date()),
            attitudeRating: document.querySelector('input[name="radioAttitude"]:checked').value,
            attitudeComment: document.getElementById("attendanceComments").value,
            attendanceRating: document.querySelector('input[name="radioAttendance"]:checked').value,
            attendanceComment: document.getElementById("attitudeComments").value,
            additionalComments: document.getElementById("registerComments").value
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });

        document.getElementById("form").innerHTML = `<div class="submitSuccess">Thank you for submitting Feedback about student:<br>
        StudentID: ` + subjectArray[0].data().studentID +
        `<br>Student Name: ` + subjectArray[0].data().studentName +
        `<br>Your feedback will help to improve outcomes for our VET For School Students.
        <br><br><button class="afterSubmitButton animation a5" onclick="location.href='../index.html'" type="button">HOME</button></div>`;
        return false;
    }
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

// Function to build the table with information from the firebase information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(data) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];
    // reset the table
    tableRef.innerHTML = "";

    data.forEach(function(subject){
        tableBuild += '<td data-title = "CRN">'
        + subject.data().CRN
        + '</td><td data-title = "Code">'
        + subject.data().shortName
        + '</td><td data-title = "Name">'
        + subject.data().longName
        + '</td><td data-title = "Timing">'
        + subject.data().term
        + '</td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
    });

    // Now table is created, add the onclick items for the cells
    highlight_row();
}

// Function retrieved from https://jsfiddle.net/armaandhir/Lgt1j68s/
function highlight_row() {
    var table = document.getElementById('table');
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        // Take each cell
        var cell = cells[i];
        // do something on onclick event for cell
        cell.onclick = function () {
            // Get the row id where the cell exists
            var rowId = this.parentNode.rowIndex;

            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].style.border = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.style.backgroundColor = "#6fe99a";
            rowSelected.style.border = "thick solid #4456ea";
            table.style.border = "";
            document.getElementById('subjectSelectorHeading').style.backgroundColor = '#6fe99a';
            rowSelected.className += " selected";
            // Set the subject selected flag to true
            subjectSelected = true;
            subjectSelectedFromTable = rowSelected.cells[1].innerHTML;
        }
    }

} //end of function