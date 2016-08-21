liedbase.controller('LevensliederenController', function ($scope, $http, log, dbFactory) {
    var html;
    
    $scope.grab = function() {
        $.get("http://www.levensliederen.net/portfolio/psalm-15/", function(data){
            verses = $(data).find('.one-half p');

            log.info("ll log start")
            for(i=1;i<=verses.length;i++) {
                var html = verses[i-1].innerHTML
                log.info(html)
                if(html != "") {
                    var doc = {
                        "_id": "gezang_15_" + i,
                        "book": 'gezang',
                        "chapter": '15',
                        "verse": ""+i,
                        "text": html
                    }
                    dbFactory.put(doc)
                } else {
                    log.info('text leeg op: ' + i)
                }
            }
            log.info("ll log end")
        });
    }
})