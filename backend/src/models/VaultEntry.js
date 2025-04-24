const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const vaultEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Finance', 'Health', 'Personal', 'Notes'],
        required: true
    },
    encryptedContent: {
        type: String,
        required: true
    },
    autoDeleteDate: {
        type: Date,
        default: null
    },
    visibility: {
        type: String,
        enum: ['Private', 'SharedIfInactive', 'UnlockAfter'],
        default: 'Private'
    },
    unlockAfter: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Method to encrypt content
vaultEntrySchema.methods.encryptContent = function(content, encryptionKey) {
    return CryptoJS.AES.encrypt(content, encryptionKey).toString();
};

// Method to decrypt content
vaultEntrySchema.methods.decryptContent = function(encryptionKey) {
    const bytes = CryptoJS.AES.decrypt(this.encryptedContent, encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Method to check if entry should be auto-deleted
vaultEntrySchema.methods.shouldAutoDelete = function() {
    if (!this.autoDeleteDate) return false;
    return Date.now() >= this.autoDeleteDate;
};

const VaultEntry = mongoose.model('VaultEntry', vaultEntrySchema);

module.exports = VaultEntry; 