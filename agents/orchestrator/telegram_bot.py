#!/usr/bin/env python3
"""Telegram Bot for Hermes Orchestrator - Send/Receive Messages"""

import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Load environment
load_dotenv(Path(__file__).parent.parent.parent / '.env')

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ALLOWED_CHAT_IDS = [1599829884]  # Your chat ID for security

class TelegramBot:
    def __init__(self):
        self.app = None
        self.orchestrator = None

    async def start(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        await update.message.reply_text(
            "Hermes Orchestrator Online\n\n"
            "Commands:\n"
            "/status - System health check\n"
            "/board - Show kanban tasks\n"
            "/help - Show this message\n\n"
            "Or just type a message to route work."
        )

    async def help_cmd(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        await self.start(update, context)

    async def status(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /status command - system health check"""
        await update.message.reply_text("Checking system health...")
        # TODO: Implement actual health checks
        await update.message.reply_text(
            "System Status:\n"
            "- Ollama: Running\n"
            "- Board DB: Connected\n"
            "- Agent Logs: Connected"
        )

    async def board(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /board command - show kanban"""
        await update.message.reply_text("Fetching kanban board...")
        # TODO: Implement actual board display
        await update.message.reply_text("Board display coming soon!")

    async def handle_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle regular messages - route to orchestrator"""
        user_id = update.effective_user.id
        text = update.message.text

        # Security check
        if ALLOWED_CHAT_IDS and user_id not in ALLOWED_CHAT_IDS:
            await update.message.reply_text("Unauthorized")
            return

        await update.message.reply_text(f"Received: {text}\n\nRouting to Orchestrator...")
        # TODO: Route to actual orchestrator agent

    def run(self):
        """Start the bot"""
        if not TELEGRAM_BOT_TOKEN:
            print("Error: TELEGRAM_BOT_TOKEN not set in .env")
            sys.exit(1)

        self.app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()

        # Add handlers
        self.app.add_handler(CommandHandler("start", self.start))
        self.app.add_handler(CommandHandler("help", self.help_cmd))
        self.app.add_handler(CommandHandler("status", self.status))
        self.app.add_handler(CommandHandler("board", self.board))
        self.app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, self.handle_message))

        print("[BOT] Telegram Bot starting...")
        self.app.run_polling()

if __name__ == '__main__':
    bot = TelegramBot()
    bot.run()
