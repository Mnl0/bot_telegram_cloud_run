import loadEnv from "./readenv.js";
loadEnv();
import TelegramBot from "node-telegram-bot-api";
import express from "express";
import { GoogleGenAI } from "@google/genai";

const TOKEN = process.env.TOKEN;
const PORT = process.env.PORT_SV || 3000;
const WEBHOOK_PATH = process.env.WEBHOOK_PATH;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!TOKEN || !WEBHOOK_PATH || !GEMINI_API_KEY) {
	console.error("❌ Error: Faltan variables de entorno necesarias.");
	process.exit(1);
}

const ai = new GoogleGenAI({});
// Función principal de IA
async function main() {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: "Explique cómo funciona la IA en pocas palabras.",
	});
	return response.text;
}


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

// Comando /start
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	const user = msg.from.username || msg.from.first_name;
	const welcomeMessage = `🚀 ¡Hola ${user}! Bienvenido al Bot IA

	📋 Comandos disponibles:
	/start - Mostrar este mensaje
	/help - Ayuda
	/weather <ciudad> - Clima de una ciudad
	/quote - Frase motivacional
	/time - Hora actual
	/ia <pregunta> - Pregunta a la IA`;

	bot.sendMessage(chatId, welcomeMessage);
});

// Comando /help
bot.onText(/\/help/, (msg) => {
	const chatId = msg.chat.id;
	const helpMessage = `📚 **Ayuda del Bot**
	
	🌤️ /weather madrid - Obtener clima
	💭 /quote - Frase del día
	⏰ /time - Hora actual
	🤖 /ia ¿Qué es JavaScript? - Pregunta a la IA
		
	💡 También puedes escribir cualquier mensaje y la IA responderá.`;

	bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Comando /weather
bot.onText(/\/weather (.+)/, async (msg, match) => {
	const chatId = msg.chat.id;
	const ciudad = match[1];

	try {
		// Simulamos una consulta de clima (podrías usar una API real como OpenWeatherMap)
		const climaInfo = await obtenerClima(ciudad);
		bot.sendMessage(chatId, climaInfo);
	} catch (error) {
		bot.sendMessage(chatId, `❌ Error al obtener el clima de ${ciudad}`);
	}
});

// Comando /quote
bot.onText(/\/quote/, (msg) => {
	const chatId = msg.chat.id;
	const frases = [
		"🌟 El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
		"💪 No esperes a que llegue la oportunidad. Créala.",
		"🚀 El único modo de hacer un gran trabajo es amar lo que haces.",
		"⭐ Cree en ti mismo y todo será posible.",
		"🎯 Los sueños no funcionan a menos que tú lo hagas."
	];

	const fraseAleatoria = frases[Math.floor(Math.random() * frases.length)];
	bot.sendMessage(chatId, fraseAleatoria);
});

// Comando /time
bot.onText(/\/time/, (msg) => {
	const chatId = msg.chat.id;
	const ahora = new Date();
	const horaActual = ahora.toLocaleString('es-ES', {
		timeZone: 'America/Lima',
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	});

	bot.sendMessage(chatId, `⏰ **Hora actual:**\n${horaActual}`, { parse_mode: 'Markdown' });
});

// Comando /ia para preguntas específicas
bot.onText(/\/ia (.+)/, async (msg, match) => {
	const chatId = msg.chat.id;
	const pregunta = match[1];
	const user = msg.from.username || msg.from.first_name;

	try {
		console.log(`🤖 ${user} pregunta a la IA: ${pregunta}`);
		const respuestaIA = await preguntarIA(pregunta);
		bot.sendMessage(chatId, `🤖 **Respuesta de la IA:**\n${respuestaIA}`, { parse_mode: 'Markdown' });
	} catch (error) {
		bot.sendMessage(chatId, "❌ Error al procesar tu pregunta. Inténtalo de nuevo.");
	}
});

// Función para clima (ejemplo simulado)
async function obtenerClima(ciudad) {
	// Aquí podrías conectar a una API real como OpenWeatherMap
	// Por ahora simularemos datos
	const climas = {
		'madrid': '🌤️ Madrid: 22°C, Parcialmente nublado',
		'barcelona': '☀️ Barcelona: 25°C, Soleado',
		'lima': '🌫️ Lima: 18°C, Nublado',
		'bogota': '🌧️ Bogotá: 15°C, Lluvioso'
	};

	const ciudadLower = ciudad.toLowerCase();
	return climas[ciudadLower] || `🌍 Clima de ${ciudad}: Información no disponible`;
}

// Función mejorada para preguntas a la IA
async function preguntarIA(pregunta) {
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: `Responde de manera clara y concisa: ${pregunta}`,
	});
	return response.text;
}

// Manejador para mensajes generales (sin comandos)
bot.on('message', async (msg) => {
	// Solo procesar si no es un comando (no empieza con /)
	if (!msg.text || msg.text.startsWith('/')) {
		return;
	}

	const chatId = msg.chat.id;
	const user = msg.from.username || msg.from.first_name;

	try {
		console.log(`👤 Mensaje de ${user}: ${msg.text}`);
		const msgIa = await preguntarIA(msg.text);
		console.log(`💬 Respondiendo al chat ID: ${chatId}`);
		bot.sendMessage(chatId, `🤖 ${msgIa}`);
	} catch (error) {
		bot.sendMessage(chatId, "❌ Error al procesar tu mensaje. Inténtalo de nuevo.");
	}
});

app.listen(PORT, () => {
	console.log(`🟢 Servidor NodeJS iniciado en http://localhost:${PORT}`);
});