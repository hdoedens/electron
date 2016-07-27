liedbase.controller('RawInputController', function ($scope, log, Liturgie) {

	$scope.liturgie = Liturgie;

  $scope.copyRawInput = function (rawInput) {
		if (rawInput == null || rawInput.trim().length == 0) {
			$scope.rawInputError = "Invoer is leeg, niets te doen"
			return;
		}
		$scope.rawInputError = ""
		// flush existing onderdelen
		$scope.liturgie = []
		rawInputLines = rawInput.split("\n")
		for (index in rawInputLines) {
			if (rawInputLines[index].trim() == "") {
				continue
			}
			var onderdeel = { regel: '' }
			onderdeel.regel = rawInputLines[index]

			$scope.liturgie.push({ regel: onderdeel.regel, class: "input-group", documents: [], icon: "fa-question" })
		}
		// for (index in rawInputLines) {
		// 	$scope.manageInputs(index, onderdeel)
		// }
	}

})