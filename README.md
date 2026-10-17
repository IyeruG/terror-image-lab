# TERROR LAB — Analog Horror Studio

Prototipo web para crear imágenes de terror analógico. Incluye:
- Subida de imágenes desde el dispositivo.
- Efectos locales en Canvas: contraste, desaturación, separación RGB, ruido y scanlines.
- Prompts preparados para estilos VHS, found footage y analog horror.
- Descarga de la vista previa como PNG.
- Estructura de servidor para conectar generación de imágenes con IA mediante Replicate.

## Importante: efectos locales vs. IA real

**Efectos locales** transforma los píxeles de la foto en el navegador. No necesita API y no envía la imagen a un servidor.

**Generación con IA** llama al servidor Node/Express. Necesita un token de Replicate y una versión de modelo. Los modelos de imagen tienen esquemas de entrada diferentes; por eso debes elegir un modelo de Replicate y revisar su documentación antes de usarlo para edición imagen-a-imagen. El endpoint de ejemplo pasa `prompt` y, si existe, `image`; puede requerir adaptación al modelo escogido.

## Ejecutar localmente

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Abre la dirección local que indique Vite (normalmente `http://localhost:5173`).

El cliente se ejecuta en Vite y el servidor API en `http://localhost:8787`. Sin credenciales de IA, el modo **Generación con IA** mostrará un mensaje explicando que falta configurar el proveedor; los efectos locales sí funcionan.

## Activar la generación con IA

1. Crea una cuenta en [Replicate](https://replicate.com/).
2. Genera un API token desde tu cuenta.
3. Escoge un modelo de generación o edición de imágenes y revisa su esquema de entrada.
4. Copia `.env.example` como `.env` y configura:
   - `REPLICATE_API_TOKEN`: token secreto.
   - `REPLICATE_MODEL_VERSION`: identificador de versión del modelo compatible.
5. Si el modelo usa otros nombres de campos (por ejemplo `input_image` en vez de `image`) adapta `server/index.js` según la documentación de ese modelo.
6. Reinicia el servidor.

**Nunca publiques el archivo `.env`, ni pongas el token en React, Vite, HTML o en un repositorio público.** El `.gitignore` ya excluye `.env`.

> El endpoint básico usa `Prefer: wait`, pero algunos modelos pueden tardar más y devolver `starting` o `processing`. Para producción, implementa consulta de estado por ID y valida las URLs de salida. No expongas el servidor sin límites de uso, validación, límites de tamaño y protección contra abuso.

## Publicarlo en GitHub

1. Descomprime este proyecto.
2. Crea un repositorio vacío en GitHub llamado `terror-image-lab`.
3. En la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Initial TERROR LAB prototype"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/terror-image-lab.git
git push -u origin main
```

Reemplaza `TU-USUARIO` por tu nombre de usuario de GitHub.

GitHub guarda el código, pero no ejecuta automáticamente el backend ni oculta secretos por sí solo. Para desplegarlo, usa un hosting que permita un servidor Node (por ejemplo Render, Railway o similar), configura las variables de entorno allí y publica el frontend. GitHub Pages por sí solo no ejecuta `server/index.js`.

## Limitaciones conocidas

- Los efectos Canvas son filtros visuales; **no inventan anatomía, caras ni criaturas nuevas** como lo haría un modelo generativo.
- El resultado de IA depende del modelo y de sus parámetros. La entrada de imagen debe ser compatible con el modelo elegido.
- El prototipo no incluye cuentas de usuario, almacenamiento permanente, cola de trabajos, pagos ni controles de abuso.
- La imagen original y el prompt se envían al proveedor solo cuando el usuario elige el modo IA y pulsa generar.

## Estructura

```text
terror-image-lab/
├── src/
│   ├── main.jsx
│   └── styles.css
├── server/
│   └── index.js
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Tecnologías

React, Vite, CSS, Canvas API, Node.js, Express y endpoint de Replicate.
