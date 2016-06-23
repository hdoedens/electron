angular.module('liturgieApp').controller('LiturgieController', function ($scope, $http, dbService) {

		$scope.validationRules = []
		$scope.onderdelen = [{ regel: "", verzen: [], icon: "fa-question" }]

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
			// get the regel. It will look like <songtype> <songnumber> [:<verse>[,<verse>]*]
			// examples: 
			// psalm 2:34
			// gezang 45
			// lied 4:3,5
			var line = $scope.onderdelen[index].regel
			console.log('original: ' + line)
				
			// strip the regel from spaces
			line = line.trim()
			console.log('trimmed: ' + line)
			
			// get the book. i.e. the part before the first space
			var book = line.match(/^([123 ]{0,2}[a-zA-Z0-9]*)[ ]+(.*)[:.*]?$/)[1].trim()
			console.log('book: ' + book)
			
			// get the chapter. i.e. the word after the first space and before an optional :
			var chapter = line.match(/^[123 ]{0,2}[a-zA-Z0-9]*[ ]+(.*)[:.*]?$/)[1]
			console.log('chapter: ' + chapter)
			
			// get first and last verse
			var verseLimits = {min:-1, max:-1}
			try {
				verseLimits = {min:line.match(/: *([\d]+).*$/)[1], max:line.match(/(\d+)\D*$/)[1]}
			} catch(error) {
				console.log('verseLimits could not be determined; using defaults')
			}
			console.log(verseLimits)
			
			// get individual verses to know which ones to keep
			// split everything after the : on ,
			var keep = []
			if(line.indexOf(',') != -1) {
				keep = line.match(/:(.*)/)[1].split(',')
			}
			console.log(keep)
			
			// db.get('psalm1:1').then(function(res) {
			// 	// Update UI (almost) instantly
			// 	$scope.onderdelen[index].tekst = JSON.stringify(res.tekst);
			// })
			dbService.find({
				selector: {
					book: 'gezang',
					vers: { $gt: 1 }
				}	
			}).then(function(res) {
				// Update UI (almost) instantly
				$scope.onderdelen[index].verzen = []
				for(i in res['docs']) {
					var currentDoc = res['docs'][i]
					$scope.onderdelen[index].verzen.push({id:'gezang 13', tekst:currentDoc.tekst, activeVerse:currentDoc.vers})
				}
			})
			.catch(function(err) {
				console.log(err)
				if(err.status == 404)
					$scope.onderdelen[index].verzen.push({tekst: "Niets gevonden voor: " + $scope.onderdelen[index].regel})
			})
			.finally(function() {
				$scope.got = true;
			});
		}

		$scope.clearOnderdeelDetails = function (index) {
			$scope.onderdelen[index].verzen = []
			$scope.onderdelen[index].icon = 'fa-question'
		}

		$scope.manageInputs = function (index, onderdeel) {

			// lege input toevoegen
			if (index == $scope.onderdelen.length - 1 && onderdeel.regel != '') {
				$scope.onderdelen.push({ regel: "", verzen: [], icon: "fa-question" })
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
