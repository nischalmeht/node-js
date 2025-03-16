const express = require('express');
const { authenticateRequest } = require('../middleware/auth-middleware');
const search = require('../controllers/search-controller');

const router = express.Router();

router.use(authenticateRequest)
router.get('/',search);

module.exports = router;