const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  completed: Boolean,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;