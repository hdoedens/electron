angular.module('liturgie', [])
	.controller('LiturgieController', function liturgie($scope) {
		$scope.valid = false;
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
					console.log(ngModel.$valid)
					scope.$evalAsync(read);
				});
				read(); // initialize

				// Write data to the model
				function read() {
					var valid = element.val().match(/gezang|psalm/);
					ngModel.$valid = valid;
					ngModel.$invalid = !valid;
					
					element.parent().toggleClass('has-error', !valid && element.val() != '');
					element.parent().toggleClass('has-success', valid);
				}
			}
		}
	})
