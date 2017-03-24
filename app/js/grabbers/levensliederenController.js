liedbase.controller('LevensliederenController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;

    $scope.grab = function () {
        for (p = 1; p <= 10; p++) {
            // log.debug('Proberen te downloaden van lied: ' + p)
            $http.get("http://www.levensliederen.net/portfolio/psalm-" + p).then(function (response) {
                // success
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;
                // log.debug(status)
                var verses = $(data).find('.light-wrapper .inner div.one-half:first-of-type p')
                var levenslied = $(data).find('h1.title.alignleft')[0].innerHTML.replace(/Psalm /, '')

                // log.debug(levenslied + ' gevonden, aantal verzen: ' + verses.length - 1)
                for (i = 1; i < verses.length; i++) {
                    var verseText = verses[i - 1].innerHTML
                    // log.debug('vers: ' + i + ': ' + verseText)
                    if (verseText != "") {
                        var doc = {
                            "_id": "levenslied_" + levenslied + "_" + i,
                            "book": 'levenslied',
                            "chapter": parseInt(levenslied),
                            "verse": i,
                            "text": verseText
                        }
                        dbFactory.put(doc)
                    } else {
                        log.info('text leeg op: ' + i)
                    }
                }

            }, function (response) {
                // failure
                var data = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;
                // log.debug(status)
                log.debug('lied ' + config.url + ' niet gevonden, verder naar volgende lied')
            });
        }
    }

    $scope.export = '';
    $scope.getExport = function() {
        return $sce.trustAsHtml($scope.export)
    }

    $scope.exportAll = function () {
        $scope.export = ''
        dbFactory.createIndex({
            index: {
                fields: ['chapter']
            }
        }).then(function(result) {
            return dbFactory.find({
                selector: { 'book': 'levenslied', 'chapter': {'$gt': null}},
                sort: ['chapter']
            }).then(function (res) {
                if (res.docs.length == 0) {
                    $scope.export = "Niets gevonden"
                }
                else {
                    var previousChapter = ''
                    for (i in res.docs) {
                        var currentDoc = res.docs[i]
                        // print chapter header
                        if(currentDoc.chapter != previousChapter) {
                            // find max verse number for this chapter
                            var maxVerseNumber = 0
                            for(v in res.docs) {
                                if(res.docs[v].chapter > currentDoc.chapter) {
                                    break
                                }
                                if(res.docs[v].chapter == currentDoc.chapter) {
                                    maxVerseNumber = res.docs[v].verse
                                }
                            }
                            $scope.export += '<br />levenslied ' + currentDoc.chapter + ': 1-' + maxVerseNumber + '<br />'
                        }
                        $scope.export += currentDoc.verse + '<br />'
                        $scope.export += currentDoc.text + '<br />'
                        previousChapter = currentDoc.chapter
                    }
                }
            }).catch(function (err) {
            });
        });
    }
})