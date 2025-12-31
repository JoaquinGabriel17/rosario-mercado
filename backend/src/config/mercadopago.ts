import { MercadoPagoConfig, Preference } from 'mercadopago';
/**
 * Configuración principal de Mercado Pago
 * Usa ACCESS_TOKEN desde variables de entorno
 */
export const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

/**
 * Exportamos la instancia de Preference
 * para crear preferencias desde los controladores
 */
export const mpPreference = new Preference(client);
