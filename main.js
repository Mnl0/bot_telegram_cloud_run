import loadEnv from "./readenv.js";
loadEnv();
import TelegramBot from "node-telegram-bot-api";
import express from "express";

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT_SV || 3000;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH;

const bot = new TelegramBot(TOKEN, { polling: false });
const app = express();
app.use(express.json());

app.use((req, res, next) => {
	console.log(`➡️ Petición entrante: ${req.method} ${req.url}`);
	console.log(`👤 User-Agent: ${req.headers['user-agent']}`);
	res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.post(WEBHOOK_PATH, (req, res) => {
	console.log("✅ ¡Mensaje recibido en la ruta /webhook!", req.body.message.text);
	bot.processUpdate(req.body);
	res.sendStatus(200);
});

bot.on('message', (msg) => {
	const chatId = msg.chat.id;
	const user = msg.from.username || msg.from.first_name;
	console.log(`👤 Mensaje de ${user}: ${msg.text}`);
	console.log(`💬 Respondiendo al chat ID: ${chatId}`);
	bot.sendMessage(chatId, `🚀 Hola mi Don ${user}, en que puedo ayudarlo...`);
});

app.listen(PORT, () => {
	console.log(`🟢 Servidor NodeJS iniciado en http://localhost:${PORT}`);
});