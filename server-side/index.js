const mongoose = require('mongoose');
const express = require('express');
const User = require('./Model/User');
const cors = require('cors');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
const URL = process.env.DB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// Registration route
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const secretKey = crypto.randomBytes(64).toString('hex');
    console.log("username, password => ", username, password);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Create and sign a JWT token
        const token = jwt.sign({ userId: newUser._id }, secretKey, {
            expiresIn: '1h', // Token expiration time
        });

        res.json({ message: 'User registered successfully', token, secretKey });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Define a route to validate the token
app.post('/api/validate-token', async(req, res) => {
    const { token, secretKey } = req.body;
    if (!token || !secretKey) {
        return res.json({ valid: false });
    }
    try {
        // Verify the token using the provided secret key
        const decodedToken = jwt.verify(token, secretKey);
        const user = await User.findById(decodedToken.userId);

        if (!user) {
            return res.json({ valid: false });
        }
        // If verification succeeds, the token is valid
        return res.json({ valid: true, decodedToken , userData: user }); // Return the decoded token

    } catch (error) {
        // If verification fails, the token is invalid
        return res.json({ valid: false });
    }
});


// TODO

// Create a new ToDo
app.post('/api/todos', async (req, res) => {
    const { title, description, completed, username } = req.body;
    try {
        // Find the user by their username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add the new ToDo to the user's todoList array
        const newTodo = { title, description, completed };
        user.todoList.push(newTodo);
        await user.save();

        // Respond with the newly created ToDo
        res.json({ message: 'ToDo created successfully', todo: newTodo });
    } catch (error) {
        res.status(500).json({ error: 'Error creating ToDo' });
    }
});


// Retrieve all ToDo items for a user
app.get('/api/todos/:username', async (req, res) => {
    const username = req.params.username;
    try {
        const user = await User.findOne({ username });
        console.clear();
        console.log("user ==> ", user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.todoList);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving ToDos' });
    }
});

// Update a ToDo item
app.put('/api/todos/:username/:id', async (req, res) => {
    const { title, description, completed } = req.body;
    const { username, id } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const todoIndex = user.todoList.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'ToDo not found' });
        }

        const updatedToDo = user.todoList[todoIndex];
        updatedToDo.title = title;
        updatedToDo.description = description;
        updatedToDo.completed = completed;

        await user.save();

        res.json({ message: 'ToDo updated successfully', todo: updatedToDo });
    } catch (error) {
        res.status(500).json({ error: 'Error updating ToDo' });
    }
});

// Delete a ToDo item
app.delete('/api/todos/:username/:id', async (req, res) => {
    const { username, id } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const todoIndex = user.todoList.findIndex(todo => todo.id === id);
        if (todoIndex === -1) {
            return res.status(404).json({ error: 'ToDo not found' });
        }

        user.todoList.splice(todoIndex, 1);
        await user.save();

        res.json({ message: 'ToDo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting ToDo' });
    }
});


app.listen(PORT, () => {
    console.log("PORT and URL  => ",process.env.PORT , process.env.DB_URL);
    console.log(`Server is running on port ${PORT}`);
});


