const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Load command handlers
const commandsPath = path.join(__dirname, 'scripts', 'commands');
client.commands = new Map();

fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(path.join(commandsPath, file));
        client.commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
    }
});

// Load event handlers
const eventFiles = fs.readdirSync(path.join(__dirname, 'scripts', 'events')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./scripts/events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Add utility functions to client
const { isAdmin, isOwner } = require('./utils/messageUtils');
client.isAdmin = isAdmin;
client.isOwner = isOwner;

// Handle incoming messages
client.on('message', async (message) => {
    console.log(`Received message: ${message.body} from ${message.from}`);

    const args = message.body.trim().split(/ +/);
    let commandName = args.shift().toLowerCase();

    // Check if the message starts with the prefix
    const startsWithPrefix = message.body.startsWith(config.prefix);
    if (startsWithPrefix) {
        commandName = commandName.slice(config.prefix.length);
    }

    let command = client.commands.get(commandName);

    // If no command is found and the message doesn't start with a prefix, use the 'chat' command
    if (!command && !startsWithPrefix) {
        command = client.commands.get('chat');
        args.unshift(message.body); // Add the entire message as the first argument
    }

    if (!command) return;

    // Check if the command requires a prefix
    if (command.prefix && !startsWithPrefix) return;

    // Check for admin-only commands
    if (command.adminOnly && !client.isAdmin(message.from) && !client.isOwner(message.from)) {
        return message.reply('You do not have permission to use this command.');
    }

    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        await message.reply('There was an error executing that command.');
    }
});

// Start the client
client.initialize();

