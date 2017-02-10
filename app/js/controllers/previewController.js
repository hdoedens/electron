var fs = require('fs');
var out = fs.createWriteStream('out.pptx');
var officegen = require('officegen');

liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function (data) {
    return $sce.trustAsHtml(data)
  }

  $scope.generate = function () {
    var doc = officegen('pptx');
    $scope.liturgie.forEach(function (element) {
      element.documents.forEach(function (document) {
        makeSongSlide(doc, element.title, document.verse, document.text)
      }, this);
    }, this);
    
    doc.generate(fs.createWriteStream('out.pptx'), {
      'finalize': function (written) {
        console.log('Finish to create a PowerPoint file.\nTotal bytes created: ' + written + '\n');
      },
      'error': function (err) {
        console.log(err);
      }
    });
  }

  out.on('close', function () {
    console.log('Finished to create the PPTX file!');
  });

  var makeSongSlide = function (doc, title, highlight, text) {
    var slide = doc.makeNewSlide();
    var titleInParts = getTitleParts(title, highlight)
    if(titleInParts.length == 3) {
      slide.addText([
        { text: titleInParts[0], options: { bold: false, font_size: 24 } },
        { text: titleInParts[1].toString(), options: { bold: true, font_size: 24 } },
        { text: titleInParts[2], options: { bold: false, font_size: 24 } }
      ], { x: 20, y: 30, cx: "90%" });
    } else {
      slide.addText([
        { text: titleInParts + ': ' + highlight, options: { bold: false, font_size: 24 } }
      ], { cx: "90%" });
    }
    slide.addText( text, { cx: "90%", cy: "80%", x: 20, y: 80, font_size: 24})
  }

  var getTitleParts = function (title, highlight) {

    if (title.search(':') == -1)
      return title

    // start by replacing *whitespaces with a single whitespace
    title = title.replace(/ +/g, " ")
    // split on ':'
    var titleParts = title.split(':')
    // remove whitespaces from second part 
    titleParts[1] = titleParts[1].replace(/ /g, '')
    // reassemble, replace comma's in second part by comma+whitespace
    title = titleParts[0] + ': ' + titleParts[1].replace(/,/g, ', ')

    // extract the verse being displayed
    var regex = new RegExp("(.*[^\d])(" + highlight + ")((?:[^\d]|$)(?:[0-9, ]*))")
    var match = regex.exec(title)
    var titleInParts = []
    titleInParts.push(match[1])
    titleInParts.push(highlight)
    if (match[3] != '')
      titleInParts.push(match[3])
    else
      titleInParts.push('')
    return titleInParts
  }

})