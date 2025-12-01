const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (!isValid(username)) {
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User successfully registered. Now you can login"});
  } else {
    return res.status(409).json({message: "User already exists!"});
  }
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulate async operation using Promise
    const bookList = await new Promise((resolve, reject) => {
      resolve(books);
    });
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Simulate async operation using Promise
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    // Simulate async operation using Promise
    const booksByAuthor = await new Promise((resolve, reject) => {
      const filtered = [];
      for (let key in books) {
        if (books[key].author === author) {
          filtered.push(books[key]);
        }
      }
      if (filtered.length > 0) {
        resolve(filtered);
      } else {
        reject(new Error("No books found by this author"));
      }
    });
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    // Simulate async operation using Promise
    const book = await new Promise((resolve, reject) => {
      for (let key in books) {
        if (books[key].title === title) {
          resolve(books[key]);
          return;
        }
      }
      reject(new Error("Book not found"));
    });
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    // Simulate async operation using Promise
    const reviews = await new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn].reviews);
      } else {
        reject(new Error("Book not found"));
      }
    });
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(404).json({message: error.message});
  }
});

module.exports.general = public_users;
