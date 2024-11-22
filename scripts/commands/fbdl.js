const fetch = require('node-fetch');
const { MessageMedia } = require('whatsapp-web.js');
const config = require('../../config.json');

module.exports = {
    name: 'fbdl',
    category: 'Utility',
    prefix: true,
    description: 'Download and send a Facebook video',
    guide: {
        bn: 'ফেসবুক ভিডি�� ডাউনলোড করে পাঠাতে এই কমান্ডটি ব্যবহার করুন',
        en: 'Use this command to download and send a Facebook video'
    },
    author: 'Hridoy',
    adminOnly: false,
    async execute(message, args, client) {
        if (args.length === 0) {
            return message.reply('Error: Please provide a Facebook video URL.');
        }

        const videoUrl = args[0];
        const apiUrl = `https://api.nexalo.xyz/fbdl?api=${config.nexaloApiKey}&url=${encodeURIComponent(videoUrl)}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.success) {
                // Send video information first
                await message.reply(`*Title:* ${data.title}\n\n*Downloading video, please wait...*`);

                try {
                    // Attempt to send the video file as document
                    const videoResponse = await fetch(data.links['Download High Quality']);
                    const videoBuffer = await videoResponse.buffer();

                    const media = new MessageMedia(
                        'video/mp4',
                        videoBuffer.toString('base64'),
                        `${data.title.slice(0, 60)}.mp4` // Truncate filename if too long
                    );

                    // Send as document instead of media
                    await message.reply(media, null, { 
                        sendMediaAsDocument: true,
                        caption: data.title
                    });
                } catch (videoError) {
                    console.error('Error sending video:', videoError);
                    
                    // If sending video fails, provide download links
                    const linksMessage = `*Unable to send video directly. Here are the download links:*\n\n` +
                        `*High Quality:* ${data.links['Download High Quality']}\n` +
                        `*Low Quality:* ${data.links['Download Low Quality']}`;
                    
                    await message.reply(linksMessage);
                }
            } else {
                await message.reply('Sorry, I couldn\'t download the video. Please check the URL and try again.');
            }
        } catch (error) {
            console.error('Error downloading Facebook video:', error);
            await message.reply('An error occurred while processing your request. Please try again later.');
        }
    },
};

