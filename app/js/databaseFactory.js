liedbase.factory('dbFactory', function (pouchDB, pouchDBDecorators, log) {

    var db = pouchDB('liturgieDB')
    // db.destroy()

    db.find = pouchDBDecorators.qify(db.find);

    db.createIndex({
      index: {
        fields: ['book', 'chapter'],
        name: 'book_chapter_index'
      }
    });

    return db;

})