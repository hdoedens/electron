angular.module('liturgieApp')
  .factory('dbService', function (pouchDB, pouchDBDecorators) {

    var db = pouchDB('liturgie')
    db.find = pouchDBDecorators.qify(db.find);

    db.createIndex({
      index: {
        fields: ['type'],
        name: 'type_index'
      }
    });

    var doc = {
      "_id": "gezang_13_1",
      "type": 'gezang',
      "vers": 1,
      "tekst": "gezang dertien vers een"
    }

    db.put(doc).then(function (response) {
      console.log('item created');
    }).catch(function (error) {
      console.log('item already created')
    })

    return db;

  })