liedbase.controller('BijbelController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;

    $scope.grab = function () {

        $http.get('assets/bible/BGT/genesis.txt').success(function(data){
            var lines = data.split(/\r?\n/g)
            heading = ""
            chapter = ""
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
                        "_id": "bgt_" + 'genesis' + "_" + chapter + "_" + lineparts[p-1],
                        "book": 'genesis',
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

})