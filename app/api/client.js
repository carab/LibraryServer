var request = require('request'),
    Promise = require('promise'),
    xml2js = require('xml2js');

module.exports = {
  find: find
};

function find (isbn, isbnType) {
  var promise = new Promise(function (resolve, reject) {
    findOnGoogleBook(isbn, isbnType).then(function (book) {
      resolve(book);
    }, function (err) {
      findOnIsbnDb(isbn, isbnType).then(function (book) {
        resolve(book);
      }, function (err) {
        findOnOpenLibrary(isbn, isbnType).then(function (book) {
          resolve(book);
        }, function (err) {
          reject(err);
        });
      });
    });
  });

  return promise;
}

function findOnIsbnDb(isbn, isbnType) {
  var promise = new Promise(function (resolve, reject) {
    request('http://isbndb.com/api/books.xml?access_key=H6KI7WQW&index1=isbn&value1=' + isbn + '&results=texts', function (err, res, body) {
      if (!err && res.statusCode == 200) {
        xml2js.parseString(body, function (err, data) {
          if (err) reject(err);

          if (data.ISBNdb.BookList[0].$.total_results > 0) {
            data = data.ISBNdb.BookList[0].BookData[0];

            resolve({
              title: data.Title,
              subtitle: data.TitleLong
            });
          } else {
            reject(null);
          }
        });
      } else {
        reject(err);
      }
    })
  });

  return promise;
}

function findOnOpenLibrary (isbn, isbnType) {
  var promise = new Promise(function (resolve, reject) {
    request('https://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json&jscmd=data', function (err, res, body) {
      if (!err && res.statusCode == 200) {
        var data = JSON.parse(body);

        if (data['ISBN:' + isbn]) {
          resolve({
            title: data.title,
            subtitle: data.subtitle
          });
        } else {
          reject(null);
        }
      } else {
        reject(err);
      }
    })
  });

  return promise;
}

function findOnGoogleBook(isbn, isbnType) {
  var promise = new Promise(function (resolve, reject) {
    request('https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn + '&key=AIzaSyCcEMiu8PXC0nxXE0K5i4xJHJgvPEGNpxY', function (err, res, body) {
      if (!err && res.statusCode == 200) {
        var data = JSON.parse(body);

        if (data.totalItems > 0) {
          data = data.items[0].volumeInfo;

          resolve({
            title: data.title
          });
        } else {
          reject(null);
        }
      } else {
        reject(err);
      }
    })
  });

  return promise;
}
