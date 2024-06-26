const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  const doesExist = (username) => {
    return users.some(user => user.username === username);
  };
  if (username && password) {
    // Check if username already exists
    if (!doesExist(username)) {
      // Register the user
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Unable to register user. Username and/or password not provided." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  return res.send(books[ISBN]);
});

/*
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author)
  if (booksByAuthor.length > 0) {
    return res.send(booksByAuthor)
  }
  else {
    return res.status(300).json({ message: "No books Found by author" });
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
    return res.send(booksByTitle);
  }
  else {
    return res.status(300).json({ message: "No books found by the Title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book) {
    return res.send(book.reviews)
  }
  return res.status(300).json({ message: "invalid ISBN specified" });
});
*/
//  Task10

const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};

//task 11
const getByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
      let isbnNum = parseInt(isbn);
      if (books[isbnNum]) {
          resolve(books[isbnNum]);
      } else {
          reject({ status: 404, message: `ISBN ${isbn} not found` });
      }
  });
};


//  Task 3 & Task 12
//  Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 4 & Task 12
//  Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks));
});

//  Task 5 & Task 13
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;
