liedbase.controller('InputController', function ($scope, $http, log, dbFactory, Liturgie) {

  $scope.validationRules = [];
  $http.get('./resources/validation.json').then(function (response) {
    for (n in response.data) {
      $scope.validationRules.push(response.data[n]);
    }
  });

  $scope.liturgie = Liturgie;

  $scope.$on('rawInput', function (event, rawInput) {
    $scope.liturgie.length = 0
    rawInputLines = rawInput.split("\n")
    var index = 0;
    for (index in rawInputLines) {
      var regel = rawInputLines[index].trim()
      if (regel == "" || regel == null) {
        continue
      }
      $scope.liturgie.push({ regel: regel })
      $scope.manageInput(index)
    }

    manageEmptyInputs(index);
  })

  $scope.inputChanged = function (index) {
    $scope.manageInput(index);
    manageEmptyInputs(index);
  }

  $scope.manageInput = function (index) {

    if (index >= $scope.liturgie.length) {
      log.warn('ignoring request to manage input with index ' + index + ' while onderdelen length is ' + $scope.liturgie.length)
      return
    }

    // start validate current input
    if (isValid(index)) {
      setOnderdeelDetails(index);
      $scope.liturgie[index].class = "input-group has-success"
    } else {
      clearOnderdeelDetails(index);
      $scope.liturgie[index].class = "input-group has-error"
    }

  }

  var manageEmptyInputs = function (index) {

    for (index = $scope.liturgie.length - 1; index > 0; index--) {
      if ($scope.liturgie[index].regel.trim() == '') {
        $scope.liturgie.pop()
      } else {
        break
      }
    }

    // add empty line at the end
    $scope.liturgie.push({ regel: '', class: "input-group", documents: [], icon: "fa-question" })
  }

  var isValid = function (id) {
    var value = $scope.liturgie[id].regel
    for (n in $scope.validationRules) {
      for (i in $scope.validationRules[n].regexen) {
        valid = new RegExp($scope.validationRules[n].regexen[i]).test(value)
        if (valid) {
          // gna gna, set the icon and the type here
          $scope.liturgie[id].icon = $scope.validationRules[n].icon;
          $scope.liturgie[id].type = $scope.validationRules[n].type;
          $scope.liturgie[id].getFromDb = $scope.validationRules[n].getFromDb
          return true;
        }
      }
    }
  }

  var setOnderdeelDetails = function (index) {
    $scope.liturgie[index].valid = true
    // get the regel. It will look like <book> <chapter> [:<verse>[<,|-><verse>]*]
    // examples: 
    // psalm 2: 3, 6
    // gezang 45
    // 3 johannes 4:3 - 5
    // strip the regel from spaces
    var line = $scope.liturgie[index].regel.trim()
    // log.debug('original: ' + line)

    // get the book. i.e. the part before the first space
    var book = line.match(/^([123 ]{0,2}[a-zA-Z0-9ëü]*)[ ]*.*$/)[1].trim()
    // log.debug('book: ' + book)

    // get the chapter. i.e. the word after the first space and before an optional :
    var chapter = -1
    try {
      chapter = parseInt(line.match(/^[\d]?[ ]?[a-zA-Z0-9ëü]*[ ]+([0-9a-z]+)/)[1])
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
      // convert all keeper string to int
      for(var i=0; i<keep.length; i++) { keep[i] = parseInt(keep[i], 10); } 
    }
    // log.debug('keep: ' + keep)

    // If the chapter == -1, it is most likely not a thingy in the database, so skip the search
    if ($scope.liturgie[index].getFromDb) {
      // get all documents from the chapter
      dbFactory.find({
        selector: { book: book, chapter: chapter, verse: {'$gt': null} },
        sort: ['book', 'chapter', 'verse']
      }).then(function (res) {
        // empty current document array
        $scope.liturgie[index].documents = []
        if (res.docs.length == 0) {
          $scope.liturgie[index].documents.push({ note: "Niets gevonden voor: " + $scope.liturgie[index].regel })
        }
        else {
          // keep all documents
          if (keep.length == 0) {
            for (i in res.docs) {
              var currentDoc = res.docs[i]
              $scope.liturgie[index].documents.push(currentDoc)
              if($scope.liturgie[index].type == "song") {
                if(i == 0) {
                  $scope.liturgie[index].title = $scope.liturgie[index].regel + ': ' + currentDoc.verse;
                } else {
                  $scope.liturgie[index].title += ', ' + currentDoc.verse;
                }
              } else if($scope.liturgie[index].type == "scripture") {
                // remove multiple whitespaces
                title = $scope.liturgie[index].regel.replace(/ +/g, " ");
                $scope.liturgie[index].title = capitalizeFirstLetter( $scope.liturgie[index].regel);
              }
            }
          }
          // keep a subset of documents
          else {
            // switch on liturgiepart type
            if($scope.liturgie[index].type == 'song') {
              for (i in res.docs) {
                var currentDoc = res.docs[i]

                // on first doc, start building the title
                if(i == 0) {
                  $scope.liturgie[index].title = capitalizeFirstLetter(book) + ' ' + chapter + ': ';
                }

                var keepIndex = keep.indexOf(currentDoc.verse)
                // current doc verse not found in keep, so throw away
                if (keepIndex == -1) {
                  continue;
                }
                
                // remove from keep to indicate we will save the doc
                keep.remove(currentDoc.verse)
                $scope.liturgie[index].documents.push(currentDoc)
                
                // expand title
                if($scope.liturgie[index].title.endsWith(": ")) {
                  $scope.liturgie[index].title += currentDoc.verse;
                } else {
                  $scope.liturgie[index].title += ', ' + currentDoc.verse;
                }
              }

              if(keep.length > 0)
                $scope.liturgie[index].documents.push({ note: "De volgende verzen konden niet worden gevonden: " + keep })
            } else if ($scope.liturgie[index].type == 'scripture') {
              for (i in res.docs) {
                var currentDoc = res.docs[i]
                if(currentDoc.verse >= verseLimits.min && currentDoc.verse <= verseLimits.max) {
                  $scope.liturgie[index].documents.push(currentDoc)
                }
                // start by replacing *whitespaces with a single whitespace
                title = $scope.liturgie[index].regel
                title = title.replace(/ +/g, " ")
                // split on ':'
                var titleParts = title.split(':')
                // remove whitespaces from second part 
                titleParts[1] = titleParts[1].replace(/ /g, '')
                // reassemble, replace comma's in second part by comma+whitespace
                title = titleParts[0].trim() + ': ' + titleParts[1].replace(/-/g, ' - ')
                $scope.liturgie[index].title = capitalizeFirstLetter(title);
              }
            } else {
              console.log("[ERROR] Unknown liturgie type");
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

  var clearOnderdeelDetails = function (index) {
    $scope.liturgie[index].valid = false
    $scope.liturgie[index].documents = []
    $scope.liturgie[index].icon = 'fa-question'
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

})