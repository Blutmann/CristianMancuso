/**
 * Configuración centralizada de producción — Cristian Mancuso Atelier.
 * Editá WHATSAPP_NUMBER aquí para actualizar todos los canales de WhatsApp
 * del sitio (Configurador, Mi Selección, Cómo Pedir, Footer y Empresas).
 */
export const WHATSAPP_NUMBER = "5491158543013";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
