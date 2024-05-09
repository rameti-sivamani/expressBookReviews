const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')
let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const validusers = users.filter((user) => {
    return user.username === username && user.password === password
  })
  if (validusers.length > 0) {
    return true
  }
  else {
    return false
  }
};
const app = express();
app.use(session({
  secret: "fingerpint",
  resave :true, 
  saveUninitialized : true
}));
app.use(express.json());
 
//only registered users can login 
 
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(username)) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 6 });

      req.session.authorization = {
        accessToken, username
      }
      return res.status(300).json({ message: "user loggin in successfully" })
    }
    else {
      return res.status(401).json({ message: "Invalid password" })
    }
  }
  return res.status(300).json({ message: "User not yet registered" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
