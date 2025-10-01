# 🤖 Bot de Telegram con IA - Guía de Comandos

## 📋 **Comandos Básicos Implementados**

### 🚀 **Comandos Principales**
- `/start` - Mostrar mensaje de bienvenida y lista de comandos
- `/help` - Ayuda detallada del bot
- `/ia <pregunta>` - Hacer una pregunta específica a la IA

### 🌤️ **Información y Utilidades**
- `/weather <ciudad>` - Obtener clima de una ciudad (datos simulados)
- `/time` - Mostrar hora actual
- `/quote` - Frase motivacional aleatoria

### 🎮 **Interacción**
- Cualquier mensaje sin comando será respondido por la IA
- La IA responde de forma contextual a tus preguntas

---

## 🌟 **Comandos Adicionales Disponibles** (en ejemplos_comandos.js)

### 🌐 **APIs Externas**
- `/clima <ciudad>` - Clima real con OpenWeatherMap API
- `/cripto <moneda>` - Precio de criptomonedas
- `/traducir <texto>` - Traducir texto automáticamente

### 🎯 **Utilidades**
- `/dado` - Tirar un dado virtual
- `/nota <contenido>` - Guardar una nota personal
- `/misnotas` - Ver todas tus notas guardadas
- `/cortar <url>` - Acortar URLs
- `/info` - Ver tu información de usuario

### 📊 **Estadísticas y Admin**
- `/stats` - Estadísticas del bot

### 🎨 **Creatividad**
- `/imagen <descripción>` - Generar descripción para crear imágenes con IA

### 🎮 **Juegos**
- `/adivinanza` - Juego de adivinar números (1-100)

---

## 🔧 **Cómo Agregar Nuevos Comandos**

### 1. **Comando Simple** (respuesta fija):
```javascript
bot.onText(/\/micomando/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "🎉 ¡Respuesta de mi comando!");
});
```

### 2. **Comando con Parámetros**:
```javascript
bot.onText(/\/saluda (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const nombre = match[1];
    bot.sendMessage(chatId, `👋 ¡Hola ${nombre}!`);
});
```

### 3. **Comando con IA**:
```javascript
bot.onText(/\/consulta (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const pregunta = match[1];
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Responde esta consulta: ${pregunta}`
        });
        
        bot.sendMessage(chatId, `🤖 ${response.text}`);
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al procesar la consulta");
    }
});
```

### 4. **Comando con API Externa**:
```javascript
bot.onText(/\/noticia/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        const response = await fetch('https://api.noticias.com/latest');
        const data = await response.json();
        
        bot.sendMessage(chatId, `📰 ${data.titulo}: ${data.resumen}`);
    } catch (error) {
        bot.sendMessage(chatId, "❌ Error al obtener noticias");
    }
});
```

---

## 🔑 **Variables de Entorno Necesarias**

Agrega estas variables a tu archivo `.env`:

```env
# Telegram Bot
TOKEN=tu_token_de_telegram
WEBHOOK_PATH=/webhook
PORT_SV=3000

# Google AI
GEMINI_API_KEY=tu_api_key_de_gemini

# APIs Opcionales
WEATHER_API_KEY=tu_api_key_de_openweathermap
NEWS_API_KEY=tu_api_key_de_noticias
```

---

## 📦 **Dependencias Recomendadas**

Para funciones avanzadas, puedes instalar:

```bash
npm install axios          # Para llamadas HTTP más fáciles
npm install node-cron      # Para tareas programadas
npm install sqlite3        # Para base de datos local
npm install moment         # Para manejo de fechas
npm install sharp          # Para procesamiento de imágenes
```

---

## 🚀 **Ejemplos de Uso en Telegram**

```
Usuario: /start
Bot: 🚀 ¡Hola usuario! Bienvenido al Bot IA...

Usuario: /weather Madrid
Bot: 🌤️ Madrid: 22°C, Parcialmente nublado

Usuario: /ia ¿Qué es JavaScript?
Bot: 🤖 JavaScript es un lenguaje de programación...

Usuario: /quote
Bot: 🌟 El éxito es la suma de pequeños esfuerzos...

Usuario: Hola, ¿cómo estás?
Bot: 🤖 ¡Hola! Estoy muy bien, gracias por preguntar...
```

---

## 💡 **Tips para Desarrollo**

1. **Manejo de Errores**: Siempre usar try-catch para comandos con APIs
2. **Validación**: Validar entrada de usuarios antes de procesarla
3. **Límites**: Implementar rate limiting para evitar spam
4. **Logs**: Usar console.log para debugging
5. **Testing**: Probar cada comando antes de publicar

---

## 🎯 **Próximos Pasos Sugeridos**

1. **Base de Datos**: Implementar SQLite para persistir datos
2. **Autenticación**: Sistema de usuarios y permisos
3. **Webhooks**: Configurar webhooks para mejor performance
4. **Análisis**: Implementar analytics y métricas
5. **Multi-idioma**: Soporte para múltiples idiomas
6. **Multimedia**: Soporte para imágenes, audio y documentos