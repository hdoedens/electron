var officegen = require('officegen');
var fs = require('fs');
var doc = officegen('pptx');
var out = fs.createWriteStream('out.pptx');

liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function (data) {
    return $sce.trustAsHtml(data)
  }

  $scope.generate = function () {
    $scope.liturgie.forEach(function(element) {
      element.documents.forEach(function(document) {
        makeSongSlide(element.regel, document.text)
      }, this);
    }, this);
    doc.generate(out);
  }

  doc.on('finalize', function (written) {
    console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');
  });

  doc.on('error', function (err) {
    console.log(err);
  });

  out.on('close', function () {
    console.log('Finished to create the PPTX file!');
  });

  var makeSongSlide = function(title, text) {
    var slide = doc.makeNewSlide();
    slide.addText(title, 20, 20)
    slide.addText(text, 20, 80)
  }

})