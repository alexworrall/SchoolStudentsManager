var db = firebase.firestore();

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var subjects = db.collectionGroup('students');
subjects.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        //console.log(doc.id, ' => ', doc.data());
        if (!studentArray.includes(doc.data().name) && doc.data().name != undefined){
            // Not duplicate, add to array.
            studentArray.push(doc.data().name);
        }
        studentInfo = {
          name: doc.data().name,
          school: doc.data().school,
        };
        // Add the student name and school object into an array for processing later.
      studentInfoArray.push(studentInfo);

    });
    
    // Populate the drop down box
    studentArray.forEach(function(item, array) {
        // Add those lecturers to the drop down box
        var opt = document.createElement('option');
        opt.innerHTML = item;
        opt.value = item;
        sel.appendChild(opt);
    })
});


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