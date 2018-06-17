var jwt    = require('jsonwebtoken')

var config
if (process.env.NODE_ENV == "prod") config = require('../../config-prod')
else config = require('../../config-dev')

var p = console.log

function requireAuthentication(req, res, next) {
  var token = req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.SECRET, function(err, decoded) {
      if (err) {
        return res.status(403).send('Invalid Auth Token.\n')
      } else {
        req.decoded = decoded
        return next();
      }
    })
  } else {
    return res.status(400).send('No token provided.\n')
  }
}

module.exports = {
  requireAuthentication: requireAuthentication
}
