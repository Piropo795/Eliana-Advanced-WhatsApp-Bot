module.exports = {
    name: 'hello',
    category: 'General',
    prefix: true,
    description: 'Greets the user',
    guide: {
        bn: 'এই কমান্ডটি ব্যবহার করে বটকে শুভেচ্ছা জানাতে পারেন',
        en: 'Use this command to greet the bot'
    },
    author: 'Hridoy',
    adminOnly: false,
    async execute(message, args, client) {
        await message.reply('Hello! How can I assist you today?');
    },
};

