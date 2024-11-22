const fetch = require('node-fetch');
const config = require('../../config.json');

module.exports = {
    name: 'ai',
    category: 'AI',
    prefix: true,
    description: 'Ask a question to Gemini AI',
    guide: {
        bn: 'জেমিনি এআই-কে একটি প্রশ্ন জিজ্ঞাসা করতে এই কমান্ডটি ব্যবহার করুন',
        en: 'Use this command to ask a question to Gemini AI'
    },
    author: 'Hridoy',
    adminOnly: false,
    async execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('Error: Please provide a question for the AI.');
        }

        const question = args.join(' ');
        const apiUrl = `https://api.nexalo.xyz/gemini?api=${config.geminiApiKey}&text=${encodeURIComponent(question)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.response) {
                await message.reply(data.response);
            } else {
                await message.reply('Sorry, I couldn\'t generate a response. Please try again.');
            }
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            await message.reply('An error occurred while processing your request. Please try again later.');
        }
    },
};

