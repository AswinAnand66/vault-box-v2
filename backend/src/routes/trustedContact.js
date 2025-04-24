const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const trustedContactController = require('../controllers/trustedContactController');

router.post('/set', auth, trustedContactController.setContact);
router.post('/request-access', trustedContactController.requestAccess);
router.post('/emergency-access', trustedContactController.getEmergencyAccess);

module.exports = router; 