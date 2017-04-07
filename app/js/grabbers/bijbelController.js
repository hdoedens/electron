var pathlib = require('path')

liedbase.controller('BijbelController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;
    var bibleBaseDir = './app/assets/bible/';

    var readBibleBook = function(path) {
        $http.get(path).success(function(data, returnCode, headers, uri) {
            var path = uri.url
            var pathparts = path.split(pathlib.sep)
            var vertaling = pathparts[pathparts.length - 2]
            var book = pathparts[pathparts.length - 1].substring(0, pathparts[pathparts.length - 1].indexOf('.'))
            var heading = ""
            var chapter = ""
            var lines = data.split(/\r?\n/g)
            for(var i=0; i<lines.length; i++) {
                var line = lines[i];
                if(line == "")
                    continue;
                if(line.startsWith("=")) {
                    heading += line.substring(1) + "\n"
                    continue;
                } 
                if(line.startsWith("#")) {
                    chapter = line.substring(1)
                    continue;
                }

                lineparts = line.split(/(\d+)(?=[a-zA-Z])/)
                for(var p=2; p<lineparts.length; p+=2) {
                    var doc = {
                        "_id": vertaling + "_" + book + "_" + chapter + "_" + lineparts[p-1],
                        "book": book,
                        "chapter": parseInt(chapter),
                        "verse": parseInt(lineparts[p-1]),
                        "text": lineparts[p],
                        "heading": heading
                    }
                    dbFactory.put(doc)
                    // clear heading and chapter
                    heading = ""
                }
            
            }
        });
    }

    $scope.grab = function () {

        require('node-dir').files(__dirname, function(err, files) {
            for(i=0; i<files.length; i++) {
                path = files[i]
                if(path.indexOf('bible') > -1) {
                    readBibleBook(path);
                }
            }
        });

    }

})