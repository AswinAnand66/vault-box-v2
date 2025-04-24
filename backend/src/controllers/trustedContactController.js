const User = require('../models/User');
const VaultEntry = require('../models/VaultEntry');
const nodemailer = require('nodemailer');
const config = require('../config/config');

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    }
});

const trustedContactController = {
    setContact: async (req, res) => {
        try {
            const { email, name, unlockDelay } = req.body;

            // Update user's trusted contact
            req.user.trustedContact = {
                email,
                name,
                unlockDelay: unlockDelay || 30
            };

            await req.user.save();

            // Send notification email to trusted contact
            await transporter.sendMail({
                to: email,
                subject: 'You have been set as a trusted contact',
                text: `Hello ${name},\n\nYou have been set as a trusted contact for ${req.user.email}'s VaultBox account. In case of emergency, you may be granted access to their vault after the specified delay period.\n\nBest regards,\nVaultBox Team`
            });

            res.json({ message: 'Trusted contact set successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error setting trusted contact', error: error.message });
        }
    },

    requestAccess: async (req, res) => {
        try {
            const { email } = req.body;

            // Find user by trusted contact email
            const user = await User.findOne({ 'trustedContact.email': email });
            if (!user) {
                return res.status(404).json({ message: 'No user found with this trusted contact email' });
            }

            // Check if user is inactive for the specified delay period
            const inactiveDays = Math.floor((Date.now() - user.lastActive) / (1000 * 60 * 60 * 24));
            if (inactiveDays < user.trustedContact.unlockDelay) {
                return res.status(403).json({ 
                    message: `User must be inactive for ${user.trustedContact.unlockDelay} days before emergency access can be granted`,
                    daysRemaining: user.trustedContact.unlockDelay - inactiveDays
                });
            }

            // Send notification to user
            await transporter.sendMail({
                to: user.email,
                subject: 'Emergency Access Request',
                text: `Your trusted contact ${user.trustedContact.name} has requested emergency access to your vault. If you are still active, please log in to prevent access.`
            });

            res.json({ 
                message: 'Emergency access request sent. User will be notified.',
                unlockDate: new Date(Date.now() + (24 * 60 * 60 * 1000)) // 24 hours from now
            });
        } catch (error) {
            res.status(500).json({ message: 'Error processing emergency access request', error: error.message });
        }
    },

    getEmergencyAccess: async (req, res) => {
        try {
            const { email, verificationCode } = req.body;

            // Find user by trusted contact email
            const user = await User.findOne({ 'trustedContact.email': email });
            if (!user) {
                return res.status(404).json({ message: 'No user found with this trusted contact email' });
            }

            // Check if user is inactive for the specified delay period
            const inactiveDays = Math.floor((Date.now() - user.lastActive) / (1000 * 60 * 60 * 24));
            if (inactiveDays < user.trustedContact.unlockDelay) {
                return res.status(403).json({ 
                    message: `User must be inactive for ${user.trustedContact.unlockDelay} days before emergency access can be granted`,
                    daysRemaining: user.trustedContact.unlockDelay - inactiveDays
                });
            }

            // Get all vault entries that are either shared or should be unlocked
            const entries = await VaultEntry.find({
                user: user._id,
                $or: [
                    { visibility: 'SharedIfInactive' },
                    { 
                        visibility: 'UnlockAfter',
                        unlockAfter: { $lte: new Date() }
                    }
                ]
            });

            // Decrypt entries
            const decryptedEntries = entries.map(entry => ({
                ...entry.toObject(),
                content: entry.decryptContent(user.password)
            }));

            res.json(decryptedEntries);
        } catch (error) {
            res.status(500).json({ message: 'Error accessing vault', error: error.message });
        }
    }
};

module.exports = trustedContactController; 