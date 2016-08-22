liedbase.controller('LevensliederenController', function ($scope, $http, log, dbFactory) {
    var verseText;
    
    $scope.grab = function() {
        for(p=1;p<=1;p++) {
            log.debug('trying to grab lied: ' + p)
            $http.get("http://www.levensliederen.net/portfolio/psalm-" + p).then(function(response) {
                // success
                var data   = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;
                log.debug(status)
                var verses = $(data).find('.one-half');
                var levenslied = $(data).find('h1.title.alignleft')[0].innerHTML.replace(/Psalm /, '')

                log.debug(levenslied + ' gevonden, aantal verzen: ' + verses.length)
                for(i=1;i<=verses.length;i++) {
                    var verseText = verses[i-1].innerHTML
                    log.debug('vers: ' + i + ': ' + verseText)
                    if(verseText != "") {
                        var doc = {
                            "_id": "levenslied_" + levenslied + "_" + i,
                            "book": 'levenslied',
                            "chapter": '' + levenslied,
                            "verse": "" + i,
                            "text": verseText
                        }
                        dbFactory.put(doc)
                    } else {
                        log.info('text leeg op: ' + i)
                    }
                }
                
            },function(response) {
                // failure
                var data   = response.data,
                    status = response.status,
                    header = response.header,
                    config = response.config;
                log.debug(status)
                log.debug('lied ' + p + ' niet gevonden, verder naar volgende lied')
            });
        }
    }
})