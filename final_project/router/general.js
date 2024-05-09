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
public_users.post('/customer/login', (req, res) => {

  if (username && password) {
    if (doesExist(username)) {
      if (users.username === username && users.password === password)
        return res.send("The user is successfully logged in...");
    }
    else {
      return res.status(300).json({ message: "The user is not registered" })

    }
  }
  else {
    return res.status(404).json({ message: "Enter the valid credentials" })
  }
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

module.exports.general = public_users;
