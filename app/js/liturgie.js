angular.module('liturgie', ['pouchdb'])
	.controller('LiturgieController', function ($scope, $http, pouchDB) {

		var db = pouchDB('liturgie');

		var doc = {
			"_id": "2132",
			"gezang": 13,
			"vers": 2,
			"tekst": "er was eens een trlalalala"
		};
		db.put(doc);

		$scope.validationRules = []
		$http.get('./resources/validation.json').then(function (response) {
			for (n in response.data) {
				$scope.validationRules.push(response.data[n]);
			}
		});

		$scope.isValid = function (id, value) {
			for (n in $scope.validationRules) {
				for (i in $scope.validationRules[n].regexen) {
					valid = new RegExp($scope.validationRules[n].regexen[i]).test(value)
					if (valid) {
						// gna gna, set the icon here
						$scope.onderdelen[id].icon = $scope.validationRules[n].icon;
						return true;
					}
				}
			}
		}

		$scope.setOnderdeelDetails = function (index) {
			db.get('2132').then(function(res) {
				// Update UI (almost) instantly
				$scope.onderdelen[index].tekst = JSON.stringify(res.tekst);
			})
			.catch(function(err) {
				$scope.err = err;
			})
			.finally(function() {
				$scope.got = true;
			});

			// db.get('2132').then(function (doc) {
			// 	$scope.onderdelen[index].tekst = JSON.stringify(doc.tekst);
			// })
		}

		$scope.clearOnderdeelDetails = function (index) {
			$scope.onderdelen[index].tekst = ''
			$scope.onderdelen[index].icon = 'fa-question'
		}

		$scope.onderdelen = [{ regel: "", tekst: "", icon: "fa-question" }]

		$scope.manageInputs = function (index, onderdeel) {

			// lege input toevoegen
			if (index == $scope.onderdelen.length - 1 && onderdeel.regel != '') {
				$scope.onderdelen.push({ regel: "", tekst: "", icon: "fa-question" })
			}

			// lege input verwijderen
			if (index == $scope.onderdelen.length - 2 && onderdeel.regel == '' && $scope.onderdelen[$scope.onderdelen.length - 1] == '') {
				$scope.onderdelen.pop()
			}

			$scope.onderdelen[index].regel = onderdeel.regel;
		}

	})
	.directive('testValidity', function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attrs, ngModel) {

				element.on('blur keyup change', function () {
					scope.$evalAsync(read);
				});
				read(); // initialize

				// Write data to the model
				function read() {
					var valid = scope.isValid(attrs.id, element.val())
					if (valid)
						scope.setOnderdeelDetails(attrs.id);
					else
						scope.clearOnderdeelDetails(attrs.id);
					ngModel.valid = valid;
					ngModel.invalid = !valid;

					element.parent().toggleClass('has-error', !valid && element.val() != '');
					element.parent().toggleClass('has-success', valid);
				}
			}
		}
	})
