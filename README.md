# Integrated Thinking System

## Overview
This is a fresh start for the Integrated Thinking System (統合思考システム). 
Designed to centralize intelligence, strategy, and personal growth.

## Core Pillars
- **Career Strategy**: Focused on Infrastructure, Logistics, and Heavy Industry.
- **External Brain**: Continuous logging of insights via Antigravity.
- **Technical Evolution**: Integrating AI capabilities for high-speed thinking.
- **Discord Integration**: Send and receive Discord messages from the dashboard.

## Getting Started
1. Copy `.env.example` to `.env` and fill in your Discord credentials:
   ```
   cp .env.example .env
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open `http://localhost:3000` to access the dashboard.

## Discord Setup
1. Create a Discord application at https://discord.com/developers/applications.
2. Under **Bot**, click **Add Bot** and copy the bot token.
3. Enable the **Message Content Intent** under **Privileged Gateway Intents**.
4. Invite the bot to your server using the OAuth2 URL generator (select `bot` scope with `Send Messages` and `Read Message History` permissions).
5. Copy the target channel ID (right-click channel → Copy ID with Developer Mode enabled).
6. Set `DISCORD_BOT_TOKEN` and `DISCORD_CHANNEL_ID` in your `.env` file.
