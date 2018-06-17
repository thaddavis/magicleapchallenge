var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    required: true
  }
})

userSchema.plugin(uniqueValidator, {})

const User = mongoose.model('User', userSchema)

module.exports = { User }
