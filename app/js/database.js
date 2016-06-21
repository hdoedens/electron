angular.module('liturgieApp')
  .factory('dbService', function (pouchDB, pouchDBDecorators) {

    var db = pouchDB('liturgieDB')

    db.find = pouchDBDecorators.qify(db.find);

    db.createIndex({
      index: {
        fields: ['type'],
        name: 'type_index'
      }
    });

    var docs = [{
      "_id": "gezang_13_1",
      "book": 'gezang',
      "vers": 1,
      "tekst": "gezang dertien vers een"
    }, {
      "_id": "gezang_13_2",
      "book": 'gezang',
      "vers": 2,
      "tekst": "gezang dertien vers twee"
    }, {
      "_id": "gezang_13_3",
      "book": 'gezang',
      "vers": 3,
      "tekst": "gezang dertien vers drie"
    }]

    db.bulkDocs(docs).then(function (response) {
      console.log('item created');
    }).catch(function (error) {
      console.log('item already created')
    })

    return db;

  })