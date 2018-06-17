var aws = require('aws-sdk')
var request = require('request')
var { Asset } = require('../models/asset')
var upload = require('../middleware/multer-S3').upload;
var uploader = upload.array("asset", 1)

var config
if (process.env.NODE_ENV == "prod") config = require('../../config-prod')
else config = require('../../config-dev')

var s3 = new aws.S3({
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKey: config.S3_SECRET_KEY
})

var p = console.log

function newAsset(req, res, next) {
  uploader(req, res, function(err) {
    if (err) { return res.status(400).send(`An error occurred during your file upload.\n`) }
    var asset = new Asset({ 
	  	identifier: req.files[0].key, 
	  	originalName: req.files[0].originalname,
	  	uploadedBy: req.decoded.id
	  })
	  asset.save().then((doc) => {
	  	res.status(200).send(`Sucessfully uploaded asset!\n`)
	  }).catch((err) => {
	  	if (err) {
	  		return res.status(400).send(`An error occurred during your file upload.\n`)
	    }
	  })  
  })
}

function getAssets(req, res, next) {
	Asset.find({
		uploadedBy: req.decoded.id
	}).then((media) => {
		if (!media) { return res.status(400).send(`You have no file uploads.\n`) }
		var responseString = `\nHere are the files you have uploaded:\n\n`
		media.forEach((i, index) => { responseString += `${index+1}\nIdentifier: ${i.identifier}\nOriginal Name: ${i.originalName}\n\n` })
		responseString += `USE FILE IDENTIFIERS TO DOWNLOAD YOUR DESIRED FILES.\n\n`
		res.status(200).send(responseString)		
	}).catch((err) => {
		next(err)
	})
}

function getAsset(req, res, next) {
	Asset.findOne({
		uploadedBy: req.decoded.id,
		identifier: req.params.id
	}).then((media) => {
		if (!media) { return res.status(400).send(`No file has the specified identifier.\n`) }
		var options = {
			Bucket: config.S3_BUCKET,
			Key: req.params.id
		}
		const signedUrlExpireSeconds = 60 * 5
		const url = s3.getSignedUrl('getObject', {
	    Bucket: config.S3_BUCKET,
			Key: req.params.id,
	    Expires: signedUrlExpireSeconds,
	    ResponseContentDisposition: 'attachment; filename=' + media.originalName
		})
		request(url).pipe(res);
	}).catch((err) => {
		next(err)
	})
}

module.exports = {
	newAsset,
	getAssets,
	getAsset
}