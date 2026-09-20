const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user. Username and/or password are not provided."});
});

// Get the book list available in the shop
// Get the book list available in the shop using async-await and Promises
public_users.get('/', async function (req, res) {
    try {
      // Simulating an asynchronous operation using a Promise
      const getBooks = await new Promise((resolve, reject) => {
        resolve(books);
      });
      
      return res.status(200).send(JSON.stringify(getBooks, null, 4));
    } catch (error) {
      return res.status(500).json({message: "Error fetching books list"});
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.keys(books);
  const booksByAuthor = [];

  keys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json({booksbyauthor: booksByAuthor});
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const keys = Object.keys(books);
  const booksByTitle = [];

  keys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push({
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json({booksbytitle: booksByTitle});
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;