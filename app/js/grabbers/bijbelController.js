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
                    chapter += line.substring(1) + ' '
                    continue;
                }

                lineparts = line.split(/(\d+)/)
                for(var p=1; p<lineparts.length; p++) {
                    if(heading != "") console.log(heading)
                    if(chapter != "") console.log('Hoofdstuk '+chapter)
                    console.log(lineparts[p])

                    // clear heading and chapter
                    heading = ""
                    chapter = ""
                }
            
            }
        });

    }

})