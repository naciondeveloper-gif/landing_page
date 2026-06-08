import { escapeHtml } from '@/lib/utils/sanitize';

export interface ReservaEmailData {
  loteId: string | number;
  mz?: string;
  numero?: string | number;
  area?: string;
  precio?: string;
  nombre: string;
  telefono: string;
  correo?: string;
  mensaje?: string;
  adminUser?: string;
  fechaRegistro?: string;
}

function fechaLima(): string {
  return new Date().toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export type TipoEvento = 'reserva' | 'separado' | 'vendido';

function base(contenido: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 16px;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.10);">
      <tr>
        <td style="background:#0d1f4e;padding:28px 32px;">
          <p style="margin:0;color:#ffffff;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.55;">Consorcio Neptuno</p>
          <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">Proyecto Neptuno</h1>
        </td>
      </tr>
      <tr><td style="padding:32px 32px 24px;">${contenido}</td></tr>
      <tr>
        <td style="background:#f8f9fb;border-top:1px solid #eaecf0;padding:18px 32px;">
          <p style="margin:0;font-size:12px;color:#9ca3af;">Mensaje generado automáticamente · No responder a este correo.</p>
          <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">informes@consorcioneptuno.com</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function fila(label: string, valor: string): string {
  return `<tr>
    <td style="padding:9px 0;border-bottom:1px solid #f1f3f6;font-size:13px;color:#6b7280;width:130px;vertical-align:top;">${label}</td>
    <td style="padding:9px 0;border-bottom:1px solid #f1f3f6;font-size:13px;color:#111827;font-weight:600;">${valor}</td>
  </tr>`;
}

function seccion(titulo: string, filas: string): string {
  return `<div style="background:#f8f9fb;border-radius:10px;padding:18px 22px;margin-bottom:16px;">
    <p style="margin:0 0 12px;font-size:10px;color:#9ca3af;letter-spacing:1.5px;text-transform:uppercase;font-weight:700;">${titulo}</p>
    <table width="100%" cellpadding="0" cellspacing="0">${filas}</table>
  </div>`;
}

export function reservaAdminHtml(data: ReservaEmailData, tipo: TipoEvento = 'reserva'): string {
  const configs: Record<TipoEvento, { badge: string; badgeColor: string; titulo: string; subtitulo: string }> = {
    reserva:  {
      badge: 'NUEVA RESERVA', badgeColor: '#f59e0b',
      titulo: '¡Nueva Reserva de Lote!',
      subtitulo: 'Se registró una nueva solicitud de separación desde la página web.',
    },
    separado: {
      badge: 'SEPARADO', badgeColor: '#f59e0b',
      titulo: 'Lote Marcado como Separado',
      subtitulo: `Registrado manualmente por <strong>${escapeHtml(data.adminUser ?? 'admin')}</strong>.`,
    },
    vendido:  {
      badge: 'VENDIDO', badgeColor: '#16a34a',
      titulo: '¡Venta de Lote Registrada!',
      subtitulo: `Venta registrada por <strong>${escapeHtml(data.adminUser ?? 'admin')}</strong>.`,
    },
  };

  const cfg = configs[tipo];

  const loteFilas = [
    data.mz     ? fila('Manzana', `Mz. ${escapeHtml(data.mz)}`)       : '',
    data.numero ? fila('Lote N°', escapeHtml(String(data.numero)))     : fila('Lote ID', escapeHtml(String(data.loteId))),
    data.area   ? fila('Área',    escapeHtml(data.area))               : '',
  ].join('');

  const clienteFilas = [
    fila('Nombre',   escapeHtml(data.nombre)),
    fila('Teléfono', escapeHtml(data.telefono)),
    data.correo  ? fila('Correo',   escapeHtml(data.correo))  : '',
    data.mensaje ? fila('Mensaje',  escapeHtml(data.mensaje)) : '',
    fila('Fecha (Lima)', escapeHtml(data.fechaRegistro ?? fechaLima())),
  ].join('');

  const contenido = `
    <div style="margin-bottom:18px;">
      <span style="background:${cfg.badgeColor};color:#fff;font-size:10px;font-weight:800;letter-spacing:1.5px;padding:4px 12px;border-radius:20px;">${cfg.badge}</span>
    </div>
    <h2 style="margin:0 0 6px;font-size:20px;color:#0d1f4e;font-weight:700;">${cfg.titulo}</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5;">${cfg.subtitulo}</p>
    ${seccion('Información del Lote', loteFilas)}
    ${seccion('Datos del Cliente', clienteFilas)}`;

  return base(contenido);
}

export function reservaClienteHtml(data: ReservaEmailData): string {
  const loteLabel = data.mz && data.numero
    ? `Mz. ${escapeHtml(data.mz)} — Lote N° ${escapeHtml(String(data.numero))}${data.area ? ` (${escapeHtml(data.area)})` : ''}`
    : `Lote ID ${escapeHtml(String(data.loteId))}`;

  const loteFilas = [
    data.mz     ? fila('Manzana', `Mz. ${escapeHtml(data.mz)}`)   : '',
    data.numero ? fila('Lote N°', escapeHtml(String(data.numero))) : fila('ID', escapeHtml(String(data.loteId))),
    data.area   ? fila('Área',    escapeHtml(data.area))           : '',
    data.precio ? fila('Precio',  escapeHtml(data.precio))         : '',
  ].join('');

  const contenido = `
    <h2 style="margin:0 0 6px;font-size:20px;color:#0d1f4e;font-weight:700;">¡Tu separación fue registrada!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5;">
      Hola <strong style="color:#111827;">${escapeHtml(data.nombre)}</strong>, hemos recibido tu solicitud para el <strong style="color:#111827;">${loteLabel}</strong>.
      Uno de nuestros asesores se pondrá en contacto contigo a la brevedad.
    </p>

    ${seccion('Resumen de tu Solicitud', loteFilas)}

    <div style="background:#eff6ff;border-left:4px solid #3b82f6;border-radius:0 8px 8px 0;padding:14px 18px;margin-top:8px;">
      <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.5;">
        ¿Tienes preguntas? Escríbenos a
        <a href="mailto:informes@consorcioneptuno.com" style="color:#1e40af;font-weight:700;">informes@consorcioneptuno.com</a>
      </p>
    </div>`;

  return base(contenido);
}

export function reservaText(data: ReservaEmailData, tipo: TipoEvento = 'reserva'): string {
  const lote = data.mz && data.numero
    ? `Mz. ${data.mz} — Lote N° ${data.numero}`
    : `ID ${data.loteId}`;

  const tipoLabel = tipo === 'reserva' ? 'Nueva reserva' : tipo === 'separado' ? 'Separación' : 'Venta';

  return `${tipoLabel} — ${lote}

Nombre:   ${data.nombre}
Teléfono: ${data.telefono}
Correo:   ${data.correo || 'No proporcionado'}
Mensaje:  ${data.mensaje || 'Ninguno'}${data.adminUser ? `\nRegistrado por: ${data.adminUser}` : ''}`;
}
