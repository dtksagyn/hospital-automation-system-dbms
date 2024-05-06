const crypto = require('crypto');

// Encryption key (keep this secure)
const encryptionKey = 'alper';

// Encryption algorithm
const algorithm = 'aes-256-cbc';

// Function to encrypt SSN
function encryptSSN(ssn) {
    const cipher = crypto.createCipher(algorithm, encryptionKey);
    let encryptedSSN = cipher.update(ssn, 'utf8', 'hex');
    encryptedSSN += cipher.final('hex');
    return encryptedSSN;
}

// Function to decrypt SSN
function decryptSSN(encryptedSSN) {
    const decipher = crypto.createDecipher(algorithm, encryptionKey);
    let decryptedSSN = decipher.update(encryptedSSN, 'hex', 'utf8');
    decryptedSSN += decipher.final('utf8');
    return decryptedSSN;
}

module.exports = {encryptSSN,decryptSSN} 