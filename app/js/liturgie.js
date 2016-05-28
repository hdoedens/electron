angular.module('liturgie', [])
	.controller('LiturgieController', function liturgie($scope) {

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
			link: function(scope, el, attrs, formCtrl) {
				// find the text box element, which has the 'name' attribute
				var inputEl   = el[0].querySelector("[name]");
				// convert the native text box element to an angular element
				var inputNgEl = angular.element(inputEl);
				// get the name on the text box so we know the property to check
				// on the form controller
				var inputName = inputNgEl.attr('name');

				// apply the has-error class as soon as the user changes the text box contents
				inputNgEl.bind('keyup', function() {
					var valid = inputNgEl.val().match(/gezang|psalm/)
					el.toggleClass('has-error', !valid && inputNgEl.val() != '');
					el.toggleClass('has-success', valid);
				})
			}
		}
	})
