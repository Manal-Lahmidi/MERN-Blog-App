// Import necessary dependencies

const express = require('express');// Web framework for Node.js
const path = require('path'); // Module to manipulate file paths
const cors = require('cors');// Middleware for handling CORS requests
const mongoose= require("mongoose");// Object Data Modeling for MongoDB
const User = require('./models/User');// Import User model
const Post = require('./models/Post');// Import Post model
var bcrypt = require('bcryptjs');// Module for password hashing
const app = express();// Initialize Express application
const jwt = require('jsonwebtoken');// Manage JWT tokens
const cookieParser = require('cookie-parser');// Middleware to parse cookies
const multer = require('multer');// Middleware for handling file uploads
const uploadMiddleware = multer({dest:'uploads/'});// Configure file upload with Multer
const fs = require('fs');// Module to manipulate the file system

// Configuration for password hashing

const salt = bcrypt.genSaltSync(10);
const secret = 'ahgdbjshbgjksb6543cdqccdcd5461';

// Middlewares setup and connection to MongoDB database

app.use(cors({credentials:true, origin:'http://localhost:5173'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to the MongoDB database

mongoose.connect('mongodb+srv://manal:T0QqarwtzPe7gXZC@cluster0.rtq3eet.mongodb.net/?retryWrites=true&w=majority')

// Route for registering a new user

app.post('/register', async (req, res) => {

    // Extract registration data (username and password) from the request body
    const{username, password}=req.body;
    try{
        // Create a new user using the User model and save it to the database
        const userDoc= await User.create({
            username, 
            password: bcrypt.hashSync(password, salt),// Hash the password before saving
        });
    res.json(userDoc);// Return the created user data in response
    }
    catch(e){
        res.status(400).json(e);// Handle errors if user creation fails
    }

});

// Route for user login, generating JWT token upon successful login

app.post('/login', async (req, res) => {

    // Extract login credentials (username and password) from the request body
    const { username, password } = req.body;
    try {
        // Find the user in the database based on the username
        const userDoc = await User.findOne({ username });

        if (!userDoc) {
            return res.status(401).json({ error: 'Invalid username' });
        }

        // Verify the hashed password against the stored one in the database
        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {

            // Create a JWT token with user information
            jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
                if (err) throw err;
                // Store the token in a cookie and send back the logged-in user information in response
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});

// Route to retrieve the profile of the currently logged-in user

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
      if (err) throw err;
      res.json(info);// Send back the user information stored in the token
    });
  });

// Route for user logout by clearing the token cookie

app.post('/logout', (req,res) => {
    res.cookie('token', '').json('ok');
});

// Route for creating a new post with an uploaded file

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {

    // Handling file upload, renaming, and saving the file path
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token}=req.cookies;
    jwt.verify(token, secret, {}, async (err,info)=>{
        // Verifying the JWT token for authorization

        if(err) throw err;
        // Extracting data for the new post from the request body

        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author:info.id,// Assigning the author ID from the verified token
            })
    // Sending back the created post as a JSON response
    res.json(postDoc);
    }); 
});

// Route for updating a post with an uploaded file

app.put('/post', uploadMiddleware.single('file'), async (req, res)=>{
    // Handling file upload for post update, if any

    let  newPath= null;
    if(req.file){
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const {token}= req.cookies;
    jwt.verify(token, secret, {}, async (err,info)=>{
        if(err) throw err;
        // Extracting data for updating the post from the request body
        const {id, title, summary, content} = req.body; 
        // Finding the post by ID in the database using the Post model
        const postDoc=await Post.findById(id);
        // Checking if the logged-in user is the author of the post
        const isAuthor = JSON.stringify(postDoc.author)===JSON.stringify(info.id);
        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        // Updating the post with provided data or keeping the existing cover path if no new file uploaded
        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: newPath ? newPath: postDoc.cover,
         });      
    res.json({ postDoc });
    }); 
})

// Route for getting all posts

app.get('/post', async(req, res)=>{
    res.json(
        await Post.find()
                .populate('author', ['username'])// Populate author details in the post data
                .sort({createdAt: -1})// Sort posts by creation date in descending order
                .limit(20));// Limit the response to the latest 20 posts
        })
        
// Route for getting a specific post by its ID

app.get('/post/:id', async (req, res) => {
            const { id } = req.params;
            const post = await Post.findById(id)
                                    .populate('author', ['username']);
            
            if (!post) {
                return res.status(404).json({ error: 'Post not found' });
            }
        
            res.json(post);
});
        
/*we create a basic web server that listen to requests from port 4000 
and resend a json response*/
app.listen(4000);


//T0QqarwtzPe7gXZC
//mongodb+srv://manal:T0QqarwtzPe7gXZC@cluster0.rtq3eet.mongodb.net/?retryWrites=true&w=majority