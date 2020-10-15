var db = firebase.firestore();

//Gather the lecturers details from the enrolled subjects to populate the dropdown
var coordinators = db.collectionGroup('school');
coordinators.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
        //console.log(doc.id, ' => ', doc.data());
        createRow(doc.data());
    });
    
});


// Function to build the table with information from the JSON information gathered before.
// Code sourced from the HIT238 resources from Matt Elvey and customised.
function createRow(schoolData) {
    // Create a variable which holds the HTML table which will be built for the students programatically
    var tableBuild = "";
    var tableRef = document.getElementById('table').getElementsByTagName('tbody')[0];

        tableBuild += '<td data-title = "Name">'
        + schoolData.coordName
        + '</td><td data-title = "School">'
        + schoolData.title
        + '</td><td data-title = "Phone">'
        + '<a href="tel:' + schoolData.coordPhone + '">' + schoolData.coordPhone + '</a>'
        + '</td><td data-title = "Email">'
        + '<a href="mailto:' + schoolData.coordEmail + '?subject=TAFE SA Vet For School Student Enquiry">' + schoolData.coordEmail + '</a>'
        + '</td><td data-title = "Address">'
        + '<a href="https://www.google.com/maps/search/?api=1&query=' + schoolData.title.replace(/\s/g, '+') + '" target="_blank">' + schoolData.coordAddress + '</a>'
        + '</td><td data-title="" class="directionsCell">'
        + '<a href="https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=' + schoolData.title.replace(/\s/g, '+') + '" target="_blank"><img src="../img/directions.png" alt="Directions Image" class="directionsImage"></a>';
        + '</td>';

        var newRow = tableRef.insertRow(-1);
        newRow.innerHTML = tableBuild;
        tableBuild = "";
}