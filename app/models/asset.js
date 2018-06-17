var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var Schema = mongoose.Schema

const assetSchema = new Schema({
  identifier: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
})

const Asset = mongoose.model('Asset', assetSchema)

module.exports = { Asset }
