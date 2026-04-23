const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/topup', userController.topUp);
router.get('/users', userController.getAllUsers);
router.get('/admin/stats', userController.getStats);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.post('/users/:id/jackpot', userController.triggerJackpot);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
