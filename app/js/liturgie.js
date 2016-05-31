angular.module('liturgie', [])
	.controller('LiturgieController', function($scope, $http) {

		$scope.validationRules = []
		$http.get('./resources/validation.json').then(function(response) {
			for(n in response.data) {
				$scope.validationRules.push(new RegExp(response.data[n]));
			}
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
	.directive('testValidity', function() {
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
					for(n in scope.validationRules) {
						valid = scope.validationRules[n].test(element.val())
						if(valid)
							break;
					}
					ngModel.valid = valid;
					ngModel.invalid = !valid;

					element.parent().toggleClass('has-error', !valid && element.val() != '');
					element.parent().toggleClass('has-success', valid);
				}
			}
		}
	})
