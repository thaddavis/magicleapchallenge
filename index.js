var express = require('express')
var mongoose    = require('mongoose')
var bodyParser  = require('body-parser')
var routes = require('./app/routes')

var config
if (process.env.NODE_ENV == "prod") config = require('./config-prod')
else config = require('./config-dev')

var app = express()

mongoose.connect(config.DATABASE)
mongoose.Promise = global.Promise

// app.use(express.limit('50mb'));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api', routes)

app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send('Error occurred.\n')
})

app.listen(config.PORT, () => console.log('App listening on port ' + config.PORT + '!'))
