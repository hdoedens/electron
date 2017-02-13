liedbase.controller('BijbelController', function ($sce, $scope, $http, log, dbFactory) {
    var verseText;

    $scope.grab = function () {

        $http.get('assets/bible/BGT/genesis.txt').success(function(data){
            data.split().foreach(function(line) {
                if(line == "")
                    return;
                if(line.startsWith("="))
                    return;
                console.log(line);
            });
        });

    }

})