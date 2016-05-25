angular.module('liturgie', [])
	.controller('LiturgieController', function liturgie($scope) {
		
		$scope.onderdelen = ['']
	
		$scope.manageInputs = function(index, regel) {
			// console.log(index + ": " + regel)
			// console.log("aantal regels: " + $scope.onderdelen.length)
			// console.log("$scope.onderdelen[index-1]: " + $scope.onderdelen[index-1])
			// console.log("regel: " + regel)
			// console.log("$scope.onderdelen.length -2: " + ($scope.onderdelen.length - 2))
			
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
	.directive('show-validity', function() {
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
				inputNgEl.pattern = "/foo/"

				// apply the has-error class as soon as the user changes the text box contents
				inputNgEl.bind('change', function() {
					el.toggleClass('has-error', formCtrl[inputName].$invalid);
				})
			}
		}
	})
