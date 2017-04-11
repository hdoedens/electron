liedbase.factory('dbFactory', function (pouchDB, pouchDBDecorators, log) {

    var db = pouchDB('liturgieDB')
    // db.destroy()

    db.setMaxListeners(50);

    db.find = pouchDBDecorators.qify(db.find);

    db.createIndex({
      index: {
        fields: ['book', 'chapter', 'verse']
      }
    }).then(function(res) {
      console.log(res);
    }).catch(function(err) {
      console.log(err);
    });

    return db;

})