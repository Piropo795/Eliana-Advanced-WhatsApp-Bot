const fetch = require('node-fetch');
const config = require('../../config.json');

module.exports = {
    name: 'chat',
    category: 'AI',
    description: 'Chat with the AI',
    guide: {
        bn: 'এআই এর সাথে চ্যাট করতে যেকোনো বার্তা পাঠান',
        en: 'Send any message to chat with the AI'
    },
    author: 'Hridoy',
    adminOnly: false,
    prefix: false,
    async execute(message, args, client) {
        const userMessage = message.body;
        const apiUrl = `https://api.nexalo.xyz/chat/v1/index?api=${config.nexaloApiKey}&question=${encodeURIComponent(userMessage)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'success') {
                await message.reply(data.answer);
            } else {
                await message.reply('Sorry, I couldn\'t process your message. Please try again.');
            }
        } catch (error) {
            console.error('Error calling chat API:', error);
            await message.reply('An error occurred while processing your message. Please try again later.');
        }
    },
};

