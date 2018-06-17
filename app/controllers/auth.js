var jwt    = require('jsonwebtoken')
var bcrypt = require('bcrypt')
var { User } = require('../models/user')

var config
if (process.env.NODE_ENV == "prod") config = require('../../config-prod')
else config = require('../../config-dev')

var p = console.log

function register(req, res, next) {

		p('register')
		p(req.body)

    if (!req.body.username) { return res.status(400).send('`username` required\n') }
		if (!req.body.password) { return res.status(400).send('`password` required\n') }
		var user = new User({ username: req.body.username, password: req.body.password })
		bcrypt.genSalt(parseInt(config.SALT_FACTOR), function(err, salt) {
			if (err) { return next(err) }
			bcrypt.hash(user.password, salt, function(err, hash) {
          if (err) { return next(err) }
	      	user.password = hash
          user.save().then((doc) => {
            var token = jwt.sign({ username: doc.username, id: doc._id }, config.SECRET, { expiresIn: 86400 })
				    res.status(200).send(`Here is your token: ${token}\n`)
          }).catch((err) => {
          	if (err) {
          		return res.status(400).send(`An error occurred during your registration process.\n`)
            }
          })
		    })
		})
}

function login(req, res, next) {
	User.findOne({
		username: (req.body.username ? req.body.username.toLowerCase() : '')
	}, function(err, user) {
		if (err) next(err)
		if (!user) {
      res.status(422).send('Authentication failed. User not found.\n')
		} else if (user) {
			bcrypt.compare(req.body.password, user.password, function(err, result) {
  			if (result) {
					var token = jwt.sign({ username: user.username, id: user._id }, config.SECRET, { expiresIn : 86400 })
					res.status(200).send(`Here is your token: ${token}\n`)
				} else if (!result) {
					res.status(401).send('Authentication failed. Wrong password.\n')
				}
    	})
		}
	})
}

function me(req, res, next) {
	res.status(200).send('VALID JWT for ' + req.decoded.username + '\n')
}

module.exports = {
	register,
	login,
	me
}
