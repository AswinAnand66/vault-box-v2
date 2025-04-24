const VaultEntry = require('../models/VaultEntry');
const CryptoJS = require('crypto-js');

const vaultController = {
    createEntry: async (req, res) => {
        try {
            const { title, category, content, autoDeleteDate, visibility, unlockAfter } = req.body;
            
            // Encrypt content using user's password as key
            const encryptedContent = CryptoJS.AES.encrypt(content, req.user.password).toString();

            const vaultEntry = new VaultEntry({
                user: req.user._id,
                title,
                category,
                encryptedContent,
                autoDeleteDate,
                visibility,
                unlockAfter
            });

            await vaultEntry.save();
            res.status(201).json(vaultEntry);
        } catch (error) {
            res.status(500).json({ message: 'Error creating vault entry', error: error.message });
        }
    },

    getEntries: async (req, res) => {
        try {
            const entries = await VaultEntry.find({ user: req.user._id });
            res.json(entries);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vault entries', error: error.message });
        }
    },

    getEntry: async (req, res) => {
        try {
            const entry = await VaultEntry.findOne({ _id: req.params.id, user: req.user._id });
            
            if (!entry) {
                return res.status(404).json({ message: 'Vault entry not found' });
            }

            // Decrypt content
            const decryptedContent = entry.decryptContent(req.user.password);
            res.json({ ...entry.toObject(), content: decryptedContent });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching vault entry', error: error.message });
        }
    },

    updateEntry: async (req, res) => {
        try {
            const { title, category, content, autoDeleteDate, visibility, unlockAfter } = req.body;
            
            const entry = await VaultEntry.findOne({ _id: req.params.id, user: req.user._id });
            
            if (!entry) {
                return res.status(404).json({ message: 'Vault entry not found' });
            }

            if (content) {
                entry.encryptedContent = CryptoJS.AES.encrypt(content, req.user.password).toString();
            }

            entry.title = title || entry.title;
            entry.category = category || entry.category;
            entry.autoDeleteDate = autoDeleteDate || entry.autoDeleteDate;
            entry.visibility = visibility || entry.visibility;
            entry.unlockAfter = unlockAfter || entry.unlockAfter;

            await entry.save();
            res.json(entry);
        } catch (error) {
            res.status(500).json({ message: 'Error updating vault entry', error: error.message });
        }
    },

    deleteEntry: async (req, res) => {
        try {
            const entry = await VaultEntry.findOneAndDelete({ _id: req.params.id, user: req.user._id });
            
            if (!entry) {
                return res.status(404).json({ message: 'Vault entry not found' });
            }

            res.json({ message: 'Vault entry deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting vault entry', error: error.message });
        }
    }
};

module.exports = vaultController; 