const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
    name: 'help',
    category: 'Utility',
    prefix: true,
    description: 'Show available commands or details of a specific command',
    guide: {
        bn: 'সকল কমান্ড দেখতে help ব্যবহার করুন। নির্দিষ্ট কমান্ডের বিস্তারিত জানতে help <cmdname> ব্যবহার করুন',
        en: 'Use help to see all commands. Use help <cmdname> to see details of a specific command'
    },
    author: 'Hridoy',
    adminOnly: false,
    prefix: false,
    async execute(message, args, client) {
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
        const language = config.language || 'en';

        if (args.length === 0) {
            // Show all command categories
            const categories = {};
            for (const file of commandFiles) {
                const command = require(path.join(commandsPath, file));
                if (!categories[command.category]) {
                    categories[command.category] = [];
                }
                categories[command.category].push(command.name);
            }

            let helpMessage = language === 'bn' ? '*উপলব্ধ কমান্ড ক্যাটাগরি:*\n\n' : '*Available Command Categories:*\n\n';
            for (const [category, commands] of Object.entries(categories)) {
                helpMessage += `*${category}*: ${commands.join(', ')}\n`;
            }
            helpMessage += language === 'bn' ? '\nনির্দিষ্ট কমান্ডের বিস্তারিত জানতে help <cmdname> ব্যবহার করুন' : '\nUse help <cmdname> for details on a specific command';

            await message.reply(helpMessage);
        } else {
            // Show details for a specific command
            const commandName = args[0].toLowerCase();
            const commandPath = path.join(commandsPath, `${commandName}.js`);

            if (fs.existsSync(commandPath)) {
                const command = require(commandPath);
                let detailMessage = `*${command.name}*\n`;
                detailMessage += `${language === 'bn' ? '*বিভাগ:* ' : '*Category:* '}${command.category}\n`;
                detailMessage += `${language === 'bn' ? '*বিবরণ:* ' : '*Description:* '}${command.description}\n`;
                detailMessage += `${language === 'bn' ? '*ব্যবহারবিধি:* ' : '*Guide:* '}${command.guide[language]}\n`;
                detailMessage += `${language === 'bn' ? '*লেখক:* ' : '*Author:* '}${command.author}\n`;
                detailMessage += `${language === 'bn' ? '*শুধুমাত্র অ্যাডমিন:* ' : '*Admin Only:* '}${command.adminOnly ? '✅' : '❌'}\n`;
                detailMessage += `${language === 'bn' ? '*প্রিফিক্স প্রয়োজন:* ' : '*Prefix Required:* '}${command.prefix ? '✅' : '❌'}`;

                if (command.prefix) {
                    detailMessage += `\n${language === 'bn' ? '*ব্যবহার:* ' : '*Usage:* '}${config.prefix}${command.name}`;
                } else {
                    detailMessage += `\n${language === 'bn' ? '*ব্যবহার:* ' : '*Usage:* '}${command.name}`;
                }

                await message.reply(detailMessage);
            } else {
                await message.reply(language === 'bn' ? 'দুঃখিত, নির্দিষ্ট কমান্ডটি পাওয়া যায়নি।' : 'Sorry, the specified command was not found.');
            }
        }
    },
};

