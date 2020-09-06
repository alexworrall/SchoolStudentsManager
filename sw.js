var CACHE_TITLE = 'my-site-cache';
var CACHE_VERSION = 'v1';
var CACHE_NAME = CACHE_TITLE + '-' + CACHE_VERSION;
var urlsToCache = [
  '/',
  '/css/main.css',
  '/css/generateFeedback.css',
  '/css/normalize.css',
  '/css/tableStyle.css',
  '/css/viewCoordinators.css',
  '/css/viewStudentList.css',
  '/script/main.js',
  '/script/feedback.js',
  '/script/firebase.js',
  '/script/viewCoordinators.js',
  '/script/viewStudentList.js'
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