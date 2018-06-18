var express	= require('express')
var router = express.Router()

// MIDDLEWARE
var requireAuth = require('../middleware/isAuthenticated').requireAuthentication

// CONTROLLERS
var Auth = require('../controllers/auth')
var Asset = require('../controllers/asset')

// ROUTES
router.get('/', (req, res, next) => {
  res.status(200).send('Welcome to AssetUploader!\n')
})
router.post('/auth/register', Auth.register)
router.post('/auth/login', Auth.login)
router.post('/auth/me', [requireAuth], Auth.me)

// router.get('/asset', [requireAuth], Auth.me)
router.post("/assets", [requireAuth], Asset.newAsset)
router.get("/assets", [requireAuth], Asset.getAssets)
router.get("/assets/:id", [requireAuth], Asset.getAsset)

module.exports = router