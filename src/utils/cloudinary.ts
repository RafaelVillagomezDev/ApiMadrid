import { v2 as cloudinary } from 'cloudinary';

// Bandera para asegurar que la configuración solo se ejecute una vez por proceso
let isCloudinaryConfigured = false;

// 1. Función interna que configura Cloudinary
const configureCloudinary = (): void => {
  if (isCloudinaryConfigured) return;

  const cloudName = process.env.CLOUDNAME;
  const apiKey = process.env.APIKEYCLOUDINARY;
  const apiSecret = process.env.APISECRETCLOUDINARY;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      'CONFIG ERROR: Falta una o más variables de entorno de Cloudinary (CLOUDNAME, APIKEYCLOUDINARY, APISECRETCLOUDINARY).',
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  isCloudinaryConfigured = true;
  console.log('[Cloudinary] Configuración cargada al primer uso.');
};

export { configureCloudinary };
