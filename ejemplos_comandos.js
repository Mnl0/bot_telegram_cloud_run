// 🌟 EJEMPLOS DE COMANDOS ADICIONALES PARA TU BOT

// 1. 🌤️ COMANDO CLIMA CON API REAL
// Necesitas registrarte en openweathermap.org y obtener una API key
bot.onText(/\/clima (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ciudad = match[1];
    const API_KEY = process.env.WEATHER_API_KEY; // Agregar a .env
    
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`);
        const data = await response.json();
        
        if (response.ok) {
            const mensaje = `🌤️ **Clima en ${data.name}**
        🌡️ Temperatura: ${data.main.temp}°C
        🌫️ Sensación térmica: ${data.main.feels_like}°C
        💧 Humedad: ${data.main.humidity}%
        ☁️ Descripción: ${data.weather[0].description}`;
            
            bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' });
        } else {
            bot.sendMessage(chatId, `❌ No pude encontrar información del clima para: ${ciudad}`);
        }
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al consultar el clima. Inténtalo más tarde.");
    }
});

// 2. 💱 COMANDO CRIPTO
bot.onText(/\/cripto (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const crypto = match[1].toLowerCase();
    
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`);
        const data = await response.json();
        
        if (data[crypto]) {
            const precio = data[crypto].usd;
            bot.sendMessage(chatId, `💰 ${crypto.toUpperCase()}: $${precio} USD`);
        } else {
            bot.sendMessage(chatId, `❌ No encontré información para: ${crypto}`);
        }
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al consultar precios de criptomonedas.");
    }
});

// 3. 🌐 COMANDO TRADUCTOR
bot.onText(/\/traducir (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const texto = match[1];
    
    try {
        // Usando la IA para traducir
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Traduce el siguiente texto al español si está en otro idioma, o al inglés si está en español: "${texto}"`
        });
        
        bot.sendMessage(chatId, `🌐 **Traducción:**\n${response.text}`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al traducir el texto.");
    }
});

// 4. 🎲 COMANDO DADOS
bot.onText(/\/dado/, (msg) => {
    const chatId = msg.chat.id;
    const resultado = Math.floor(Math.random() * 6) + 1;
    const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    bot.sendMessage(chatId, `🎲 ${dados[resultado - 1]} ¡Sacaste un ${resultado}!`);
});

// 5. 📝 COMANDO NOTAS (guardar/leer notas simples)
const notas = new Map(); // En producción, usar base de datos

bot.onText(/\/nota (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const contenido = match[1];
    
    if (!notas.has(userId)) {
        notas.set(userId, []);
    }
    
    notas.get(userId).push({
        fecha: new Date().toLocaleString('es-ES'),
        texto: contenido
    });
    
    bot.sendMessage(chatId, `📝 Nota guardada: "${contenido}"`);
});

bot.onText(/\/misnotas/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    
    if (!notas.has(userId) || notas.get(userId).length === 0) {
        bot.sendMessage(chatId, "📝 No tienes notas guardadas.");
        return;
    }
    
    const userNotas = notas.get(userId);
    let mensaje = "📝 **Tus notas:**\n\n";
    
    userNotas.forEach((nota, index) => {
        mensaje += `${index + 1}. [${nota.fecha}] ${nota.texto}\n`;
    });
    
    bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' });
});

// 6. 🎯 COMANDO ACORTADOR DE URLs
bot.onText(/\/cortar (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];
    
    // Validar si es una URL válida
    try {
        new URL(url);
        // Aquí podrías usar un servicio como bit.ly o crear tu propio acortador
        const shortUrl = `https://short.ly/${Math.random().toString(36).substr(2, 8)}`;
        
        bot.sendMessage(chatId, `🔗 **URL acortada:**\n${shortUrl}\n\n📎 Original: ${url}`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, "❌ La URL proporcionada no es válida.");
    }
});

// 7. 📊 COMANDO ESTADÍSTICAS DEL BOT
let estadisticas = {
    mensajes: 0,
    comandos: 0,
    usuarios: new Set()
};

// Middleware para contar estadísticas
bot.on('message', (msg) => {
    estadisticas.mensajes++;
    estadisticas.usuarios.add(msg.from.id);
    
    if (msg.text && msg.text.startsWith('/')) {
        estadisticas.comandos++;
    }
});

bot.onText(/\/stats/, (msg) => {
    const chatId = msg.chat.id;
    const mensaje = `📊 **Estadísticas del Bot:**
    💬 Mensajes procesados: ${estadisticas.mensajes}
    ⚡ Comandos ejecutados: ${estadisticas.comandos}
    👥 Usuarios únicos: ${estadisticas.usuarios.size}
    🕐 Tiempo activo: ${process.uptime().toFixed(0)} segundos`;
    
    bot.sendMessage(chatId, mensaje, { parse_mode: 'Markdown' });
});

// 8. 🎨 COMANDO GENERADOR DE IMÁGENES (con IA)
bot.onText(/\/imagen (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const descripcion = match[1];
    
    try {
        // Generar descripción mejorada para imagen
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Crea una descripción detallada para generar una imagen de: ${descripcion}. Incluye estilo, colores, composición y ambiente.`
        });
        
        bot.sendMessage(chatId, `🎨 **Descripción para imagen:**\n${response.text}\n\n💡 Puedes usar esta descripción en generadores de IA como DALL-E, Midjourney o Stable Diffusion.`, { parse_mode: 'Markdown' });
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al generar descripción de imagen.");
    }
});

// 9. 🔍 COMANDO INFORMACIÓN DE USUARIOS
bot.onText(/\/info/, (msg) => {
    const chatId = msg.chat.id;
    const user = msg.from;
    
    const info = `👤 **Tu información:**
    🆔 ID: ${user.id}
    📛 Nombre: ${user.first_name} ${user.last_name || ''}
    📧 Username: @${user.username || 'No definido'}
    🌍 Idioma: ${user.language_code || 'No definido'}
    💬 Chat ID: ${chatId}`;
    
    bot.sendMessage(chatId, info, { parse_mode: 'Markdown' });
});

// 10. 🎮 COMANDO JUEGO SIMPLE
const juegos = new Map();

bot.onText(/\/adivinanza/, (msg) => {
    const chatId = msg.chat.id;
    const numero = Math.floor(Math.random() * 100) + 1;
    
    juegos.set(chatId, {
        numero: numero,
        intentos: 0,
        maxIntentos: 7
    });
    
    bot.sendMessage(chatId, `🎮 **¡Juego de adivinanza!**
    🎯 He pensado un número del 1 al 100
    🎲 Tienes 7 intentos para adivinarlo
    📝 Escribe tu número para empezar`);
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    
    if (juegos.has(chatId) && !isNaN(msg.text)) {
        const juego = juegos.get(chatId);
        const guess = parseInt(msg.text);
        juego.intentos++;
        
        if (guess === juego.numero) {
            bot.sendMessage(chatId, `🎉 ¡CORRECTO! El número era ${juego.numero}
            🏆 Lo adivinaste en ${juego.intentos} intentos`);
            juegos.delete(chatId);
        } else if (juego.intentos >= juego.maxIntentos) {
            bot.sendMessage(chatId, `😔 ¡Se acabaron los intentos!
            🎯 El número era: ${juego.numero}
            🔄 Escribe /adivinanza para jugar de nuevo`);
            juegos.delete(chatId);
        } else {
            const pista = guess > juego.numero ? "📉 Muy alto" : "📈 Muy bajo";
            const restantes = juego.maxIntentos - juego.intentos;
            bot.sendMessage(chatId, `${pista}
            🎲 Intentos restantes: ${restantes}`);
        }
    }
});

export { estadisticas };