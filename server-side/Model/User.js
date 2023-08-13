const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  todoList: [
    {
      title: String,
      description: String,
      completed: Boolean
    }
  ]
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;