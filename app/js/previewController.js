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
        makeSongSlide(element.regel, document.verse, document.text)
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

  var makeSongSlide = function(title, highlight, text) {
    var slide = doc.makeNewSlide();
    var titleInParts = getTitleParts(title, highlight)
    console.log(titleInParts)
    slide.addText( [
      { text: titleInParts[0], options: { bold: false, font_size: 24 } },
      { text: titleInParts[1]+"", options: { bold: true, font_size: 24 } },
      { text: titleInParts[2], options: { bold: false, font_size: 24 } }
    ], { cx: "90%" } );
  }

  var getTitleParts = function(title, highlight) {
    
    if(title.search(':') == -1)
      return title
    
    // start by replacing *whitespaces with a single whitespace
    title = title.replace(/ +/g, " ")
    // split on ':'
    var titleParts = title.split(':')
    // remove whitespaces from second part 
    titleParts[1] = titleParts[1].replace(/ /g, '')
    // reassemble, replace comma's in second part by comma+whitespace
    title = titleParts[0]+': '+titleParts[1].replace(/,/g, ', ')

    // extract the verse being displayed
    var regex = new RegExp("(.*[^\d])("+highlight+")((?:[^\d]|$)(?:[0-9, ]*))")
    var match = regex.exec(title)
    var titleInParts = []
    titleInParts.push(match[1])
    titleInParts.push(highlight)
    if(match[3] != '')
      titleInParts.push(match[3])
    else
      titleInParts.push('')
    return titleInParts
  }

})