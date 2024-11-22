
const qrcode = require('qrcode-terminal');

module.exports = {
    name: 'qr',
    once: false,
    execute(qr) {
        console.log('Scan the QR code below with your WhatsApp app:');
        qrcode.generate(qr, { small: true });
    },
};

