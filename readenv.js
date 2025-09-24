import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url); // Obtenemos la ruta del archivo actual (equivalente a __filename en CommonJS)
const __dirname = path.dirname(__filename); // Obtenemos el directorio del archivo actual (equivalente a __dirname en CommonJS)
//construye la ruta al archivo .env en la raiz del proyecto
const pathToEnv = path.resolve(__dirname, '.env');

function loadEnv() {
	try {
		const data = fs.readFileSync(pathToEnv, 'utf8');
		const lines = data.split('\n');
		for (const line of lines) {
			if (line.trim() === '' && line.startsWith('#')) continue; // Ignorar líneas vacías y comentarios
			const indexEquals = line.indexOf('=');
			if (indexEquals === -1) continue; // Ignorar líneas sin '='
			const key = line.substring(0, indexEquals).trim();
			const value = line.substring(indexEquals + 1).trim();

			if (!process.env[key]) {
				process.env[key] = value;
			}
		}
	} catch (error) {
		if (error.code !== 'ENOENT') {
			console.error('Error al leer el archivo .env:', error);
		}
	}
}

export default loadEnv;

