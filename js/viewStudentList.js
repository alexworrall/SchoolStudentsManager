// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData = [];

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

    // Search the JSON data for student details which match the lecturer. Once the lecturer is chosen from the dropdown,
    // check the JSON information for a matching lecturer name in the registrations.

    var studentsArray = [];
    // Loop through the registrations and grab the students enrolled with the lecturer present that was chosen.
    /*function getSubjectByLecturer(code) {
        return Object.values(studentsData).filter(
          function(studentsData) {
            return studentsData.lecturer == code
          }
        );
    }
      
    var found = getSubjectByLecturer(dropDownValue);
      
    console.log(found[0].name);*/

    // Loop through the registrations and grab the subjects enrolled.
    Object.keys(jsonData).forEach(function(key) {
        var value = jsonData[key];
        // Loop through the subjects and search for the lecturers
        Object.keys(value).forEach(function(key) {
            var subjectValue = value[key];
            //Only add the lecturer to the list IF it is unique to the array. Stops duplicates in the drop down.
            if (subjectValue['lecturer'] == dropDownValue){
                // Not duplicate, add to array.
                studentsArray.push(subjectValue);
            }
        });
    });

    console.log(studentsArray);
}