angular.module('database', ['pouchdb'])
	.controller('DatabaseController', function ($scope, $http, pouchDB) {
		
    var db = pouchDB('liturgie');

    $scope.update = function() {
      var doc = {
        "_id": "2131",
        "gezang": 13,
        "vers": 2,
        "tekst": "gezang dertien vers een"
      };
      db.put(doc);
    };
  })