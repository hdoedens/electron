angular.module('liturgieApp')
  .factory('dbService', function (pouchDB, pouchDBDecorators, log) {

    var db = pouchDB('liturgieDB')
    // db.destroy()

    db.find = pouchDBDecorators.qify(db.find);

    db.createIndex({
      index: {
        fields: ['book', 'chapter'],
        name: 'book_chapter_index'
      }
    });

    var docs = [{
      "_id": "gezang_13_1",
      "book": 'gezang',
      "chapter": '13',
      "verse": '1',
      "text": "gezang dertien vers een"
    }, {
      "_id": "gezang_13_2",
      "book": 'gezang',
      "chapter": '13',
      "verse": '2',
      "text": "gezang dertien vers twee"
    }, {
      "_id": "gezang_13_3",
      "book": 'gezang',
      "chapter": '13',
      "verse": '3',
      "text": "gezang dertien vers drie"
    }]

    db.bulkDocs(docs).then(function (response) {
      log.debug('item created');
    }).catch(function (error) {
      log.debug('item already created')
    })

    return db;

  })