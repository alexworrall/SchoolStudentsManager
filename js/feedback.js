// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

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
            //console.log(item)
        })
    });


function lecturerChosen(dropDownValue){
    document.getElementById("studentName").disabled=false;

    // Search the JSON data for student details which match the lecturer. Once the lecturer is chosen from the dropdown,
    // check the JSON information for a matching lecturer name in the registrations.

    var studentsArray = [];
    // Loop through the registrations and grab the subjects enrolled.
    Object.keys(jsonData).forEach(function(key) {
        var value = jsonData[key];
        console.log(value);
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
    studentsArray.forEach(function(item, array) {
        // Add those lecturers to the drop down box
        var opt = document.createElement('option');
        opt.innerHTML = item;
        opt.value = item;
        sel.appendChild(opt);
        //console.log(item)
    })
}

var submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
  
// Use the event listener to submit the feedback through firebase.
submitFeedbackBtn.addEventListener('click', function(evt) {
    evt.preventDefault();
    var checked_attendance = document.querySelector('input[name="radioAttendance"]:checked');
    var attendanceContainer = document.getElementById('attendanceContainer');
    if(checked_attendance == null){  //Test if something was checked
        attendanceContainer.style.backgroundColor = '#ff9999';
    } 
});