var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Book = mongoose.model('Book'),
  apiClient = require('../api/client');

module.exports = function (app) {
  app.use('/book/', router);
};

// Get all books
router.get('/', function (req, res, next) {
  Book.find(function (err, books) {
    if (err) return next(err);
    res.json(books);
  });
});

// Create new book
router.post('/', function (req, res, next) {
  var book = {},
      body = req.body;

  book.title = body.title;

  if (book.isbn.length === 10) {
    book.isbn10 = body.isbn;
  } else if (book.isbn.length === 13) {
    book.isbn13 = body.isbn;
  } else {
    return res.status(400).json({
      error: 'invalidIsbn',
      message: 'ISBN is not valid'
    });
  }

  Book.create(book, function (err, book) {
    if (err) return next(err);
    res.json(book);
  });
});

// Get one book
router.get('/:id', function (req, res, next) {
  Book.findById(req.params.id, function (err, book) {
    if (err) return next(err);
    res.json(book);
  });
});

// Get one book by ISBN, calls third-party API if book is missing to fill the data
router.get('/:isbn/isbn', function (req, res, next) {
  var isbn = req.params.isbn,
      search = { isbn10: isbn },
      length = isbn.length;

  if (length === 13) {
    search = { isbn13: isbn };
  } else if (isbn.length != 10) {
    return res.status(400).json({
      error: 'invalidIsbn',
      message: 'ISBN is not valid'
    });
  }

  Book.findOne(search, function (err, book) {
    if (err) return next(err);

    if (book === null) {
      var promise = apiClient.find(isbn, length);

      promise.then(function (book) {
        res.json(book);
      }, function (err) {
        next(err);
      });
    } else {
      res.json(book);
    }
  });
});

// Update one book
router.put('/:id', function (req, res, next) {
  Book.findById(req.params.id, function (err, book) {
    if (err) return next(err);

    book.title = req.body.title;
    book.isbn = req.body.isbn;
    book.isbn10 = req.body.isbn10;
    book.isbn13 = req.body.isbn13;

    book.save(function (err) {
      if (err) return next(err);
      res.json(book);
    });
  });
});

// Delete one book
router.delete('/:id', function (req, res, next) {
  Book.remove({
    _id: req.params.id
  }, function (err, book) {
    if (err) return next(err);
    res.json(book);
  });
});
