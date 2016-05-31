angular.module('liturgie', [])
	.controller('LiturgieController', function($scope, $http) {

		$scope.validationRules
		$http.get('./resources/validation.json').then(function(response) {
			$scope.validationRules = response.data;
		});


		$scope.onderdelen = ['']

		$scope.manageInputs = function(index, regel) {

			// lege input toevoegen
			if(index == $scope.onderdelen.length -1 && regel != '') {
				$scope.onderdelen.push('')
			}

			// lege input verwijderen
			if(index == $scope.onderdelen.length -2 && regel == '' && $scope.onderdelen[$scope.onderdelen.length-1] == '') {
				$scope.onderdelen.pop()
			}

			$scope.onderdelen[index] = regel;
		}

	})
	.directive('showValidity', function() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {

				element.on('blur keyup change', function() {
					scope.$evalAsync(read);
				});
				read(); // initialize

				// Write data to the model
				function read() {
					var valid = false
					console.log(scope.validationRules)
					for(regex in scope.validationRules) {
						valid = element.val().match(regex);
					}
					ngModel.$valid = valid;
					ngModel.$invalid = !valid;

					element.parent().toggleClass('has-error', !valid && element.val() != '');
					element.parent().toggleClass('has-success', valid);
				}
			}
		}
	})
