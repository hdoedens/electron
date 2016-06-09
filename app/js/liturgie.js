angular.module('liturgie', [])
	.controller('LiturgieController', function ($scope, $http) {

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
			$scope.onderdelen[index].tekst = $scope.onderdelen[index].regel
			// $scope.onderdelen[index].icon = 'fa-music'
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
