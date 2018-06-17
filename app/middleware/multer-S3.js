var aws = require('aws-sdk')
var express = require('express')
var multer = require('multer')
var multerS3 = require('multer-s3')
var uuidv4 = require('uuid/v4')
var path = require('path')

var config
if (process.env.NODE_ENV == "prod") config = require('../../config-prod')
else config = require('../../config-dev')

var app = express()
var s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKey: config.S3_SECRET_KEY
})

var upload = multer({
  storage: multerS3({
    s3: s3, 
    bucket: config.S3_BUCKET,
    contentDisposition: function (req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    },
    metadata: function (req, file, cb) {
      cb(null, {
        'Content-Disposition': file.originalname
      })
    },
    key: function (req, file, cb) {

      // cb(null, uuidv4())
      cb(null, uuidv4())
      // cb(null, file.originalname)

    }
  })
})

module.exports = {
	upload: upload
}
