const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const vaultController = require('../controllers/vaultController');

// Create new vault entry
router.post('/', auth, vaultController.createEntry);

// Get all vault entries for user
router.get('/', auth, vaultController.getEntries);

// Get single vault entry
router.get('/:id', auth, vaultController.getEntry);

// Update vault entry
router.put('/:id', auth, vaultController.updateEntry);

// Delete vault entry
router.delete('/:id', auth, vaultController.deleteEntry);

module.exports = router; 