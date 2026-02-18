"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureCloudinary = void 0;
// cloudinary.ts
const cloudinary_1 = require("cloudinary");
const configureCloudinary = () => {
    const config = {
        cloud_name: process.env.CLOUDNAME,
        api_key: process.env.APIKEYCLOUDINARY,
        api_secret: process.env.APISECRETCLOUDINARY,
    };
    //  Verificación de Variables de Entorno
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
        console.error('❌ [ERROR CRÍTICO]: Faltan variables de entorno de Cloudinary.');
        process.exit(1); // Detiene el servidor si no hay credenciales
    }
    cloudinary_1.v2.config(Object.assign(Object.assign({}, config), { secure: true }));
    cloudinary_1.v2.api.ping()
        .then(() => console.log('✅ Cloudinary conectado y autenticado correctamente'))
        .catch((err) => {
        console.error('❌ Error de conexión con Cloudinary:', err.message);
    });
};
exports.configureCloudinary = configureCloudinary;
