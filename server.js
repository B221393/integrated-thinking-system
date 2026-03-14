require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('.'));

// ── Discord Bot ────────────────────────────────────────────────
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const recentMessages = [];
const MAX_MESSAGES = 50;

function pushMessage(msg) {
    recentMessages.push(msg);
    if (recentMessages.length > MAX_MESSAGES) recentMessages.shift();
}

client.once('ready', () => {
    console.log(`Discord bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', (msg) => {
    if (msg.channel.id !== process.env.DISCORD_CHANNEL_ID) return;
    pushMessage({
        id: msg.id,
        author: msg.author.username,
        content: msg.content,
        timestamp: msg.createdTimestamp,
        bot: msg.author.bot,
    });
});

// ── API Routes ─────────────────────────────────────────────────

// GET /api/discord/messages  — return cached messages
app.get('/api/discord/messages', (_req, res) => {
    res.json(recentMessages);
});

// POST /api/discord/messages — send a message to the channel
app.post('/api/discord/messages', async (req, res) => {
    const { content } = req.body;
    if (!content || typeof content !== 'string' || content.trim() === '') {
        return res.status(400).json({ error: 'content is required' });
    }

    try {
        const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
        if (!channel || !channel.isTextBased()) {
            return res.status(404).json({ error: 'Channel not found or not text-based' });
        }
        const sent = await channel.send(content.trim());
        const payload = {
            id: sent.id,
            author: sent.author.username,
            content: sent.content,
            timestamp: sent.createdTimestamp,
            bot: true,
        };
        pushMessage(payload);
        res.json(payload);
    } catch (err) {
        console.error('Failed to send Discord message:', err.message);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// GET /api/discord/status — bot connection health
app.get('/api/discord/status', (_req, res) => {
    res.json({
        connected: client.isReady(),
        username: client.user?.username ?? null,
    });
});

// ── Start ──────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

if (process.env.DISCORD_BOT_TOKEN) {
    client.login(process.env.DISCORD_BOT_TOKEN).catch((err) => {
        console.error('Discord login failed:', err.message);
    });
} else {
    console.warn('DISCORD_BOT_TOKEN not set — bot will not connect.');
}
