const express = require('express');
const router = express.Router();
const spinController = require('../controllers/spinController');

router.post('/spin', spinController.spin);

module.exports = router;
