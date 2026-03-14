document.addEventListener('DOMContentLoaded', () => {
    console.log('System initialized.');

    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            console.log('Interacting with system module...');
        });
    });

    // ── Discord Integration ────────────────────────────────────
    const messagesEl = document.getElementById('discord-messages');
    const form       = document.getElementById('discord-form');
    const input      = document.getElementById('discord-input');
    const statusEl   = document.getElementById('discord-status');

    function escapeHtml(text) {
        const el = document.createElement('span');
        el.textContent = text;
        return el.innerHTML;
    }

    function renderMessages(messages) {
        if (!messages.length) {
            messagesEl.innerHTML = '<p class="discord-empty">No messages yet.</p>';
            return;
        }
        messagesEl.innerHTML = messages.map(m => {
            const time = new Date(m.timestamp).toLocaleTimeString();
            return `<div class="discord-msg"><span class="msg-author">${escapeHtml(m.author)}</span><span class="msg-time">${time}</span><br/>${escapeHtml(m.content)}</div>`;
        }).join('');
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    async function fetchMessages() {
        try {
            const res = await fetch('/api/discord/messages');
            if (res.ok) renderMessages(await res.json());
        } catch { /* server may not be running */ }
    }

    async function fetchStatus() {
        try {
            const res = await fetch('/api/discord/status');
            if (res.ok) {
                const data = await res.json();
                statusEl.textContent = data.connected ? `● ${data.username}` : '● Offline';
                statusEl.classList.toggle('connected', data.connected);
                statusEl.classList.toggle('disconnected', !data.connected);
            }
        } catch {
            statusEl.textContent = '● Offline';
            statusEl.classList.add('disconnected');
            statusEl.classList.remove('connected');
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = input.value.trim();
        if (!content) return;
        input.value = '';

        try {
            await fetch('/api/discord/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            await fetchMessages();
        } catch (err) {
            console.error('Send failed:', err);
        }
    });

    // Poll every 3 seconds
    fetchStatus();
    fetchMessages();
    setInterval(fetchMessages, 3000);
    setInterval(fetchStatus, 10000);
});
