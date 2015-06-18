// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: String,
  isbn10: { type: String, unique: true },
  isbn13: { type: String, unique: true }
}, {
  toJSON: { virtuals: true }
});

BookSchema.virtual('date')
  .get(function () {
    return this._id.getTimestamp();
  });

BookSchema.virtual('isbn')
  .get(function () {
    if (this.isbn10) {
      return this.isbn10;
    }

    if (this.isbn13) {
      return this.isbn13;
    }
  });

mongoose.model('Book', BookSchema);

