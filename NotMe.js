require('dotenv').config();
const qrcode = require('qrcode-terminal');
const {Client, LocalAuth} = require('whatsapp-web.js');
const OpenAIApi = require('openai');

const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});

const client = new Client({
    authStrategy: new LocalAuth(),
});

let conversationHistory = [];
let messageBuffer = [];
let replyTimeout = null;

const filteredPhrases = [
    /**
     * You can add phrases here that will be filtered out and not replied to
     */
];

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (message) => {
    console.log(`Received message: ${message.body}`);

    const allowedNumber = '+123456678910@c.us'; // Adjust the allowed number as needed

    if (message.from !== allowedNumber || isMessageFiltered(message.body)) {
        console.log(`Message from ${message.from} ignored or filtered out.`);
        return;
    }

    messageBuffer.push(message.body);

    if (replyTimeout) {
        return;
    }

    /*
    Here you can set up a timer, from message receive to reply sent.
    Messages that are received within the timeout will be accumulated for the response.
     */
    const minDelay = 3 * 60 * 1000;
    const maxDelay = 30 * 60 * 1000;
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;

    replyTimeout = setTimeout(async () => {
        const combinedMessage = messageBuffer.join(' ');
        const response = await generateReply(combinedMessage);
        message.getChat().then(chat => {
            chat.sendMessage(response);
        });

        messageBuffer = [];
        replyTimeout = null;
    }, delay);
});

function isMessageFiltered(message) {
    if (!message.trim() || filteredPhrases.includes(message.toLowerCase().trim())) {
        return true;
    }
    return false;
}

async function generateReply(message) {
    try {
        const systemMessage = {
            role: "system",
            content: "You are a helpful assistant" // !! Important !! Adjust the ChatGPT Prompt here. You can tell him to be whatever you want.
        };

        const messagesForThisSession = [systemMessage, ...conversationHistory, {role: "user", content: message}];

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messagesForThisSession,
        });

        if (completion.choices[0] && completion.choices[0].message) {
            const responseContent = completion.choices[0].message.content.trim();

            conversationHistory.push({role: "user", content: message});
            conversationHistory.push({role: "assistant", content: responseContent});

            return responseContent;
        } else {
            return "Error generating reply";
        }
    } catch (error) {
        console.error('Error generating reply:', error);
        return 'Error generating reply';
    }
}

client.initialize();
