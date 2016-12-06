liedbase.controller('RawInputController', function ($scope, $rootScope, log) {

  $scope.copyRawInput = function (rawInput) {
		if (rawInput == null || rawInput.trim().length == 0) {
			$scope.rawInputError = "Invoer is leeg, niets te doen"
			return;
		}
		$scope.rawInputError = ""
		$rootScope.$broadcast('rawInput', rawInput)
	}

})