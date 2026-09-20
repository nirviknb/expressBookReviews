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
// Get book details based on ISBN using async-await and Promises
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    
    try {
      // Simulating an async operation with a Promise
      const getBookByISBN = await new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject({status: 404, message: "Book not found"});
        }
      });
  
      return res.status(200).json(getBookByISBN);
    } catch (error) {
      return res.status(error.status || 500).json({message: error.message});
    }
  });
  
// Get book details based on author
// Get book details based on author using async-await and Promises
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
  
    try {
      const getBooksByAuthor = await new Promise((resolve, reject) => {
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
          resolve(booksByAuthor);
        } else {
          reject({status: 404, message: "No books found by this author"});
        }
      });
  
      return res.status(200).json({booksbyauthor: getBooksByAuthor});
    } catch (error) {
      return res.status(error.status || 500).json({message: error.message});
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