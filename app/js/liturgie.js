angular.module('liturgieApp').controller('LiturgieController', function ($scope, $http, dbService, log) {

		$scope.validationRules = []
		$scope.onderdelen = [{ regel: "", class: "input-group", documents: [], icon: "fa-question" }]

		$http.get('./resources/validation.json').then(function (response) {
		for (n in response.data) {
			$scope.validationRules.push(response.data[n]);
		}
		});

		$scope.copyRawInput = function(rawInput) {
			if(rawInput == null || rawInput.trim().length == 0) {
				$scope.rawInputError = "Invoer is leeg, niets te doen"
				return;
			}
			$scope.rawInputError = ""
			// flush existing onderdelen
			$scope.onderdelen = []
			rawInputLines = rawInput.split("\n")
			for (index in rawInputLines) {
				if(rawInputLines[index].trim() == "") {
					continue
				}
				var onderdeel = {regel: ''}
				onderdeel.regel = rawInputLines[index]
				
				$scope.onderdelen.push({ regel: onderdeel.regel, class: "input-group", documents: [], icon: "fa-question" })
			}
			for (index in rawInputLines) {
				$scope.manageInputs(index, onderdeel)
			}
		}

		$scope.isValid = function (id) {
			var value = $scope.onderdelen[id].regel
			for (n in $scope.validationRules) {
				for (i in $scope.validationRules[n].regexen) {
					valid = new RegExp($scope.validationRules[n].regexen[i]).test(value)
					if (valid) {
						// gna gna, set the icon and the type here
						$scope.onderdelen[id].icon = $scope.validationRules[n].icon;
						$scope.onderdelen[id].getFromDb = $scope.validationRules[n].getFromDb
						return true;
					}
				}
			}
		}

		$scope.setOnderdeelDetails = function (index) {
			$scope.onderdelen[index].valid = true
		// get the regel. It will look like <book> <chapter> [:<verse>[<,|-><verse>]*]
		// examples: 
		// psalm 2: 3, 6
		// gezang 45
		// 3 johannes 4:3 - 5
		// strip the regel from spaces
		var line = $scope.onderdelen[index].regel.trim()
		// log.debug('original: ' + line)

		// get the book. i.e. the part before the first space
		var book = line.match(/^([123 ]{0,2}[a-zA-Z0-9ëü]*)[ ]*.*$/)[1].trim()
		// log.debug('book: ' + book)

		// get the chapter. i.e. the word after the first space and before an optional :
		var chapter = -1
		try {
			chapter = line.match(/^[\d]?[ ]?[a-zA-Z0-9ëü]*[ ]+([0-9a-z]+)/)[1]
		} catch (error) {
			// line is no song or biblebook, hence it has no chapter
		}
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
				// strip all entries from spaces
				keep = keep.map(Function.prototype.call, String.prototype.trim)
			} else {
				keep.push(tmpKeep)
			}
		}
		// log.debug('keep: ' + keep)

		// If the chapter == -1, it is most likely not a thingy in the database, so skip the search
		if($scope.onderdelen[index].getFromDb) {
			// get all documents from the chapter
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
									// log.debug(currentDoc)
								}
							}
							if (keep.length > 0) {
								// log.debug('some verses were not found: ' + keep)
								$scope.onderdelen[index].documents.push({ note: "De volgende verzen konden niet worden gevonden: " + keep })
							}
						}
					}
				}).catch(function (err) {
					log.error(err)
				}).finally(function () {
					$scope.got = true;
				});
			}
		}

		$scope.clearOnderdeelDetails = function (index) {
			$scope.onderdelen[index].valid = false
			$scope.onderdelen[index].documents = []
			$scope.onderdelen[index].icon = 'fa-question'
		}

		$scope.manageInputs = function (index, onderdeel) {

			if(index >= $scope.onderdelen.length) {
				log.warn('ignoring request to manage input with index ' + index + ' while onderdelen length is ' + $scope.onderdelen.length)
				return
			}

			// start validate current input
			if ($scope.isValid(index)) {
				$scope.setOnderdeelDetails(index);
				$scope.onderdelen[index].class = "input-group has-success"
			} else {
				$scope.clearOnderdeelDetails(index);
				$scope.onderdelen[index].class = "input-group has-error"
			}

			$scope.onderdelen[index].valid = valid;
			$scope.onderdelen[index].invalid = !valid;

			for(index = $scope.onderdelen.length - 1; index > 0; index--) {
				if($scope.onderdelen[index].regel.trim() == '') {
					$scope.onderdelen.pop()
				} else {
					break
				}
			}

			// add empty line at the end
			$scope.onderdelen.push({ regel: '', class: "input-group", documents: [], icon: "fa-question" })
		}

})
