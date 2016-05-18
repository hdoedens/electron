function liturgie($scope) {

	$scope.onderdelen = ['']

  $scope.manageInputs = function(index, regel) {
		console.log(index + ": " + regel)
		console.log("aantal regels: " + $scope.onderdelen.length)
		console.log("$scope.onderdelen[index-1]: " + $scope.onderdelen[index-1])
		console.log("regel: " + regel)
		console.log("$scope.onderdelen.length -2: " + ($scope.onderdelen.length - 2))
		
		// lege input toevoegen
		if(index == $scope.onderdelen.length -1 && regel != '') {
			$scope.onderdelen.push('')
		}
		
		// lege input verwijderen
		if(index == $scope.onderdelen.length -2 && regel == '' && $scope.onderdelen[$scope.onderdelen.length-1] == '') {
			$scope.onderdelen.pop()
		}
  }
}