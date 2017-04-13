var pathlib = require('path')

liedbase.controller('BijbelController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;
    var bibleBaseDir = './app/assets/bible/';

    var readBibleBook = function(path) {
        
    }

    $scope.grab = function () {

        require('node-dir').files(__dirname, function(err, files) {
            processBook(files, files.length-1);
        });

    }

    var processBook = function(files, index) {
        path = files[index]
        console.log('processing: ' + path)
        if(path.indexOf('bible') > -1) {
            var pathparts = path.split(pathlib.sep)
            var vertaling = pathparts[pathparts.length - 2]
            var book = pathparts[pathparts.length - 1].substring(0, pathparts[pathparts.length - 1].indexOf('.'))
            var heading = ""
            var chapter = ""
            console.log('book: ' + book)
            console.log('translation: ' + vertaling)
            console.log('======================================')
            var data = fs.readFileSync(path, 'utf8');
            var lines = data.split(/\r?\n/g)
            var counter = lines.length;
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

                // console.log('processing: ' + book + ' ' + i)
                lineparts = line.split(/(\d+)(?=[a-zA-Z])/)
                counter += lineparts.length;
                for(var p=2; p<lineparts.length; p+=2) {
                    dbFactory.put({
                        "_id": vertaling + "_" + book + "_" + chapter + "_" + lineparts[p-1],
                        "translation": vertaling,
                        "book": book,
                        "chapter": parseInt(chapter),
                        "verse": parseInt(lineparts[p-1]),
                        "text": lineparts[p],
                        "heading": heading
                    }).then(function (response) {
                        console.log(response);
                        counter -= 2;
                        console.log('counter: ' + counter + ' index: ' + index);
                        if(counter == 0 && index > 0) {
                            processBook(files, index--);
                        }
                    }).catch(function (err) {
                        console.log(err);
                    });
                    heading = ""
                }
            
            }
        }
    }


})