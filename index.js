require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const client = new Client({ intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
]})


const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
      organization: process.env.OPENAI_ORG,
      apiKey: process.env.OPENAI_KEY
});
const openai = new OpenAIApi(configuration);

client.on('messageCreate', async function(message){
      try {
            // console.log(message);
            if(message.author.bot) return;
            /* Tại đây bạn muốn giới hạn ở một channel nào đó điền ID vào
            if(message.channel.id !== '1234567890123456789') return; */
            if(message.content.startsWith('!')) return;

            let conversationLog = [{ role: 'system', content: "Bạn là người bạn tốt." }];

            await message.channel.sendTyping();

            let prevMessages = await message.channel.messages.fetch({ limit: 15 });
            prevMessages.reverse();

            prevMessages.forEach((msg) =>{
                  if(message.content.startsWith('!')) return;
                  if(msg.author.id !== client.user.id && message.author.bot) return;
                  if(msg.author.id !== message.author.id) return;

                  conversationLog.push({
                        role: 'user',
                        content: msg.content,
                  })
            })

            const result = await openai.createChatCompletion({
                  model: 'gpt-3.5-turbo',
                  messages: conversationLog,
            })

            message.reply(result.data.choices[0].message);
      } catch (error) {
            console.log(err)
      }
})

client.login(process.env.TOKEN).then(() => {
      console.log("ChatBot đã sẵn sàng trên discord");
      client.user.setActivity({
            name: "Trung",
            type: ActivityType.Streaming,
            url: "https://www.youtube.com/watch?v=nInxHXD5mt4"
      })
});
