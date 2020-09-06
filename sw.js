var CACHE_TITLE = 'my-site-cache';
var CACHE_VERSION = 'v1';
var CACHE_NAME = CACHE_TITLE + '-' + CACHE_VERSION;
var urlsToCache = [
  '/SchoolStudentManager',
  '/SchoolStudentsManager/css/main.css',
  '/SchoolStudentsManager/css/generateFeedback.css',
  '/SchoolStudentsManager/css/normalize.css',
  '/SchoolStudentsManager/css/tableStyle.css',
  '/SchoolStudentsManager/css/viewCoordinators.css',
  '/SchoolStudentsManager/css/viewStudentList.css',
  '/SchoolStudentsManager/js/main.js',
  '/SchoolStudentsManager/js/feedback.js',
  '/SchoolStudentsManager/js/firebase.js',
  '/SchoolStudentsManager/js/viewCoordinators.js',
  '/SchoolStudentsManager/js/viewStudentList.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});