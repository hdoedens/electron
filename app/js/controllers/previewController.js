var fs = require('fs');
var out = fs.createWriteStream('out.pptx');
var officegen = require('officegen');

liedbase.controller('PreviewController', function ($sce, $scope, log, Liturgie) {
  $scope.liturgie = Liturgie;

  $scope.getHtml = function (onderdeel) {
    // for debugging
    console.log(onderdeel)
    if(onderdeel.icon == "fa-book") {
      return $sce.trustAsHtml(getBookContents(onderdeel));
    }
    if(onderdeel.icon == "fa-music") {
      return $sce.trustAsHtml(getSongPreview(onderdeel));
    }
  }

  var getBookContents = function(onderdeel) {
    data = "";
    if(onderdeel.documents.length == 1 && onderdeel.documents[0].note != null) {
      return "<i>" + onderdeel.documents[0].note + "</i>";
    } 
    for(i=0;i<onderdeel.documents.length;i++) {
      doc = onderdeel.documents[i];
      if(doc.heading != "")
        data += "<h5><i>" + doc.heading.replace("\n", "<br />") + "</i></h5>";
      data += doc.verse + ' ' + doc.text
    }
    return data;
  }

  var getSongPreview = function(onderdeel) {
    data = "";
    if(onderdeel.documents.length == 1 && onderdeel.documents[0].note != null) {
      data = "<i>" + onderdeel.documents[0].note + "</i>";
    } 
    return data;
  }

  $scope.generate = function () {
    var doc = officegen('pptx');
    $scope.liturgie.forEach(function (element) {
      if(element.icon == "fa-music") {
        element.documents.forEach(function (document) {
          makeSongSlide(doc, element.title, document.verse, document.text)
        }, this);
      }
      if(element.icon == "fa-book") {
        makeBookSlide(doc, element);
      }
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

  var makeBookSlide = function(doc, element) {
    var slide = doc.makeNewSlide();

    text = getBookContents(element)

    // replace html tags with other ppt stuff
    // replace line-breaks
    text = text.replace(/<br \/>/gm, "\n");
    text = text.replace(/<h5>/gm, "\n");
    text = text.replace(/<\/h5>/gm, '');

    slide.addText([
      { text: element.title, options: { bold: false, font_size: 24 } }
    ], { cx: "90%" });

    textParts = text.split("</i>");
    textParts.forEach(function(part) {
      if(part.startsWith("<i>")) {
        text = part.replace(/<\/?i>/gm, '');
        slide.addText( text, { cx: "90%", cy: "80%", x: 20, y: 80, italic: true, font_size: 24}) 
      } else {
        text = part.replace(/<\/?i>/gm, '');
        slide.addText( text, { cx: "90%", cy: "80%", x: 20, y: 80, italic: false, font_size: 24}) 
      }
    });
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