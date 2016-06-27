angular.module('liturgieApp').controller('LiturgieController', function ($scope, $http, dbService, log) {

		$scope.validationRules = []
		$scope.onderdelen = [{ regel: "", documents: [], icon: "fa-question" }]

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
		// get the regel. It will look like <book> <chapter> [:<verse>[<,|-><verse>]*]
		// examples: 
		// psalm 2: 3, 6
		// gezang 45
		// 3 johannes 4:3 - 5
		var line = $scope.onderdelen[index].regel
		// log.debug('original: ' + line)

		// strip the regel from spaces
		line = line.trim()
		// log.debug('trimmed: ' + line)

		// get the book. i.e. the part before the first space
		var book = line.match(/^([123 ]{0,2}[a-zA-Z0-9]*)[ ]+(.*)[:.*]?$/)[1].trim()
		// log.debug('book: ' + book)

		// get the chapter. i.e. the word after the first space and before an optional :
		var chapter = line.match(/^[\d]?[ ]?[a-zA-Z0-9]*[ ]+([0-9a-z]+)/)[1]
		// log.debug('chapter: ' + chapter)

		// get first and last verse
		var verseLimits = { min: -1, max: -1 }
		try {
			verseLimits = { min: line.match(/: *([\d]+).*$/)[1], max: line.match(/(\d+)\D*$/)[1] }
		} catch (error) {
			// log.debug('verseLimits could not be determined; using defaults')
		}
		// log.debug('verseLimitMin: ' + verseLimits.min)
		// log.debug('verseLimitMax: ' + verseLimits.max)

		// get individual verses to know which ones to keep
		// split everything after the : on ,; if no , keep the one verse
		var keep = []
		if (line.indexOf(':') != -1) {
			var tmpKeep = line.match(/:(.*)/)[1]
			if (tmpKeep.indexOf(',') != -1) {
				keep = tmpKeep.split(',')
				// strip all raay entry from spaces
				keep = keep.map(Function.prototype.call, String.prototype.trim)
			} else {
				keep.push(tmpKeep)
			}
		}
		log.debug('keep: ' + keep)

		// get the objects from min to max
		dbService.find({
			selector: { book: book, chapter: chapter }
		}).then(function (res) {
			// Update UI (almost) instantly
			$scope.onderdelen[index].documents = []
			if (res.docs.length == 0) {
				$scope.onderdelen[index].documents.push({ note: "Niets gevonden voor: " + $scope.onderdelen[index].regel })
			}
			else {
				// keep all documents
				if(keep.length == 0) {
					for (i in res.docs) {
						var currentDoc = res.docs[i]
						$scope.onderdelen[index].documents.push(currentDoc)
					}
				} 
				// keep a subset of documents
				else {
					for (i in res.docs) {
						var currentDoc = res.docs[i]
						var keepIndex = keep.indexOf(currentDoc.verse)
						if (keepIndex > -1) {
							$scope.onderdelen[index].documents.push(currentDoc)
							keep.remove(currentDoc.verse)
							log.debug(currentDoc)
						}
					}
					if (keep.length > 0) {
						log.debug('some verses were not found: ' + keep)
						$scope.onderdelen[index].documents.push({ note: "De volgende verzen konden niet worden gevonden: " + book + ' ' + chapter + ':' + keep })
					}
				}
			}
		}).catch(function (err) {
			log.debug(err)
		}).finally(function () {
			$scope.got = true;
		});
		}

		$scope.clearOnderdeelDetails = function (index) {
			$scope.onderdelen[index].documents = []
			$scope.onderdelen[index].icon = 'fa-question'
		}

		$scope.manageInputs = function (index, onderdeel) {

			// lege input toevoegen
			if (index == $scope.onderdelen.length - 1 && onderdeel.regel != '') {
				$scope.onderdelen.push({ regel: "", documents: [], icon: "fa-question" })
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
