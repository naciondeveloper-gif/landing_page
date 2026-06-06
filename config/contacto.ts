export const WHATSAPP_NUMBER = '51924888889';
export const WHATSAPP_DISPLAY = '924 888 889';
export const EMAIL = 'informes@consorcioneptuno.com';
export const DIRECCION = 'KM 52 Pan. Sur – Chilca, Lima';

export function waLink(texto?: string): string {
  const encoded = texto ? encodeURIComponent(texto) : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${encoded ? `?text=${encoded}` : ''}`;
}
