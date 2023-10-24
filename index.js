require("dotenv").config();
const fs = require('fs');
const { Client, GatewayIntentBits, ActivityType, REST } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { Configuration, OpenAIApi } = require('openai');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

// Tên tệp JSON để lưu ID kênh
const CHANNELS_FILE = 'channels.json';

// Định nghĩa lệnh slash
const commands = [
    {
        name: 'set-channel',
        description: 'Đặt kênh máy chủ',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Đã bắt đầu làm mới các lệnh ứng dụng (/).');

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log('Đã tải lại thành công các lệnh ứng dụng (/).');
    } catch (error) {
        console.error(error);
    }
})();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, member } = interaction;

    if (commandName === 'set-channel') {
        // Kiểm tra xem người dùng có quyền "ADMINISTRATOR" hay không
        if (member.permissions.has('ADMINISTRATOR')) {
            const channelID = interaction.channel.id;

            // Đọc dữ liệu từ tệp JSON
            let channelData = {};
            try {
                channelData = JSON.parse(fs.readFileSync(CHANNELS_FILE));
            } catch (error) {
                console.error(error);
            }

            // Lưu ID kênh vào dữ liệu
            channelData[interaction.guildId] = channelID;

            // Ghi lại dữ liệu vào tệp JSON
            fs.writeFileSync(CHANNELS_FILE, JSON.stringify(channelData, null, 4));

            interaction.reply(`Kênh máy chủ đã được đặt thành <#${interaction.channel.id}>`);
        } else {
            interaction.reply('Bạn cần có quyền "administrator" để sử dụng lệnh này.');
        }
    }
});



client.on('messageCreate', async function (message) {
    try {
        if (message.author.bot) return;

        // Kiểm tra xem message có bắt đầu bằng '!' hay không
        if (message.content.startsWith('!')) return;

        // Đọc dữ liệu từ tệp JSON
        let channelData = {};
        try {
            channelData = JSON.parse(fs.readFileSync(CHANNELS_FILE));
        } catch (error) {
            console.error(error);
        }

        // Kiểm tra xem kênh hiện tại có trùng khớp với ID kênh đã được đặt không
        if (channelData[message.guild.id] !== message.channel.id) {
            //message.reply('Bạn không được phép sử dụng bot ở đây.');
            return;
        }

        // Gửi tin nhắn ban đầu để kêu người dùng đợi
        const waitingMessage = await message.channel.send('Đợi một chút, tôi đang xử lý...');

        let conversationLog = [{ role: 'system', content: "Bạn là người bạn tốt." }];

        let prevMessages = await message.channel.messages.fetch({ limit: 15 });
        prevMessages.reverse();

        prevMessages.forEach((msg) => {
            if (message.content.startsWith('!')) return;
            if (msg.author.id !== client.user.id && message.author.bot) return;
            if (msg.author.id !== message.author.id) return;

            conversationLog.push({
                role: 'user',
                content: msg.content,
            });
        });

        const result = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo-16k',
            messages: conversationLog,
        });

        // Gửi tin nhắn của OpenAI
        await message.reply(result.data.choices[0].message);

        // Xóa tin nhắn "Đợi một chút" sau khi xong
        waitingMessage.delete();
    } catch (error) {
        // Xử lý lỗi
        console.error(error);
        message.reply('Có lỗi xảy ra. Vui lòng thử lại sau.');

        // Hoặc bạn có thể gửi tin nhắn riêng lẻ cho người dùng để thông báo lỗi
        // message.author.send('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
});


client.login(process.env.TOKEN).then(() => {
    console.log("ChatBot đã sẵn sàng trên Discord");
    client.user.setActivity({
        name: "Trung",
        type: ActivityType.Streaming,
        url: "https://www.youtube.com/watch?v=nInxHXD5mt4"
    });
});
