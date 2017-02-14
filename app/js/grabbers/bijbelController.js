liedbase.controller('BijbelController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;

    $scope.grab = function () {

        $http.get('assets/bible/BGT/genesis.txt').success(function(data){
            var lines = data.split(/\r?\n/g)
            dbLine = ""
            for(var i=0; i<lines.length; i++) {
                var line = lines[i];
                if(line == "")
                    continue;
                if(line.startsWith("=")) {
                    dbLine += line.substring(1) + "\n"
                    continue;
                } 
                if(line.startsWith("#")) {
                    dbLine += line.substring(1) + ' '
                    continue;
                }

                dbLine += line
                console.log(dbLine);
                dbLine = "";
            
            }
        });

    }

})