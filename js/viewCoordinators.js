/// Create empty variable for the JSON data to be used later to reduce down the API calls.
var jsonData;

var db = firebase.firestore();
// Grab the lecturer information from the JSON and show in the dropdown box.
//var list = data['Episodes'];
var sel = document.getElementById('studentName');
var studentArray = [];
// Array to hold all the subjects for the chosen student
var subjectArray = [];
var studentInfoArray = [];

// variable to hold the status of the table and whether a row is selected or not
var subjectSelected = false;

// Variable to hold the selected subject from the table
var subjectSelectedFromTable = "";

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

function studentChosen(dropDownValue){

    // When the student drop down changes, check which student was chosen and find the school that they belong to.

    // Hide the help heading now that the user has selected something from the dropdown.
    var headingHide = document.querySelector('.hideHeading');
    headingHide.style.display = 'none';

    // get access to the table body
    var tb = document.querySelector('#table tbody');

    // Search for the students name to find the school details about the student from our object array.
    let studentObj = studentInfoArray.find(o => o.name === dropDownValue);
    var schoolDetails;
    var docRef = db.collection("school").doc(studentObj.school);

    docRef.get().then(function(doc) {
        if (doc.exists) {
          schoolDetails = doc.data();

          // while tb has children, remove the first one
      while (tb.childNodes.length) {
        tb.removeChild(tb.childNodes[0]);
    }

    // Pass the object through to the function to add it to the HTML table
    createRow(schoolDetails);

    // Make the map visible and add in the address for the school
    "use strict";

    var school = {lat: parseFloat(schoolDetails.lat), lng: parseFloat(schoolDetails.lng)};
    // The map, centered at Uluru
    var map = new google.maps.Map(
        document.getElementById('coordMap'), {zoom: 12, center: school});
    // The marker, positioned at Uluru
    var marker = new google.maps.Marker({position: school, map: map});

    var infoWindow = new google.maps.InfoWindow;

    var markers = [];
    markers.push(marker);
    
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Add a marker for the user and make it blue to stand out
          var meMarker = new google.maps.Marker({position: pos, map: map, clickable: true, icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'});
          meMarker.info = new google.maps.InfoWindow({
            content: 'You are here'
          });

          meMarker.info.open(map, meMarker);
          
          // Listener for the users map icon
          google.maps.event.addListener(meMarker, 'click', function() {
            meMarker.info.open(map, meMarker);
          });

          // Add the users marker to the marker array for use in the bounds later
          markers.push(meMarker);

          // Loop through all markers and extend the map bounds to fit the markers
          var bounds = new google.maps.LatLngBounds();
          for (var i = 0; i < markers.length; i++) {
              bounds.extend(markers[i].getPosition());
          }

          // Make the map fit the bounds we just gathered
          map.fitBounds(bounds);

        }, function() {
          handleLocationError(true, infoWindow, map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
      }
    
    // Style the map container to show the map at the right size 
    var mapOuter = document.querySelector('.mapContainer');
    mapOuter.style.visibility = "visible";
    mapOuter.style.height = "350px";

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
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

//https://www.google.com/maps/dir/?api=1&origin=Space+Needle+Seattle+WA&destination=Pike+Place+Market+Seattle+WA&travelmode=bicycling
//https://www.google.com/maps?saddr=My+Location&daddr=760+West+Genesee+Street+Syracuse+NY+13204