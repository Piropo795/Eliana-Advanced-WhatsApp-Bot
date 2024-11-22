module.exports = {
    name: 'admin',
    category: 'Administration',
    prefix: true,
    description: 'Performs an admin-only action',
    guide: {
        bn: 'এই কমান্ডটি শুধুমাত্র অ্যাডমিনরা ব্যবহার করতে পারবেন',
        en: 'This command can only be used by admins'
    },
    author: 'Hridoy',
    adminOnly: true,
    async execute(message, args, client) {
        await message.reply('This is an admin-only command. You have the required permissions to use it.');
    },
};

