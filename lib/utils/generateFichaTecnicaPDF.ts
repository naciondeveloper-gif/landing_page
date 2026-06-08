import { jsPDF } from 'jspdf';

const PRIMARY   = [30,  58,  138] as const;  // #1e3a8a
const SECONDARY = [184, 135,  11] as const;  // #b8870b
const BG_LIGHT  = [248, 249, 252] as const;  // #f8f9fc
const TEXT_DARK = [ 26,  28,  33] as const;  // #1a1c21
const TEXT_MID  = [ 68,  71,  78] as const;  // #44474e
const GOLD_BG   = [255, 243, 205] as const;  // #fff3cd

const specs = [
  { label: 'Tipo de Vivienda',  value: 'Casa + Lote — 1 piso' },
  { label: 'Habitaciones',      value: '2 dormitorios' },
  { label: 'Baños',             value: '1 baño completo' },
  { label: 'Área de Terreno',   value: '90 m²' },
  { label: 'Área Techada',      value: '35 m²' },
  { label: 'Total de Lotes',    value: '309 unidades' },
];

export async function generateFichaTecnicaPDF() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;

  // ── Header background ──────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 42, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Conjunto Residencial Chavín de Huántar', 14, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Consorcio Neptuno — Ficha Técnica del Proyecto', 14, 27);
  doc.setFontSize(8.5);
  doc.text('Ctra. Panamericana Sur 52, Chilca 15871 — Lima, Perú', 14, 35);

  // ── Gold accent line ────────────────────────────────────────────────
  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(1.2);
  doc.line(0, 42, W, 42);

  // ── Body background ─────────────────────────────────────────────────
  doc.setFillColor(...BG_LIGHT);
  doc.rect(0, 43, W, 254, 'F');

  // ── Section title ───────────────────────────────────────────────────
  let y = 54;

  doc.setTextColor(...SECONDARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Especificaciones Técnicas', 14, y);

  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 79, y + 2);

  // ── Specs table ─────────────────────────────────────────────────────
  y += 10;
  const rowH    = 13;
  const colLabel = 14;
  const colValue = 100;
  const tableW   = W - 28;

  specs.forEach((s, i) => {
    const rowY = y + i * rowH;
    doc.setFillColor(i % 2 === 0 ? 240 : 255, i % 2 === 0 ? 243 : 255, i % 2 === 0 ? 250 : 255);
    doc.roundedRect(colLabel, rowY - 5, tableW, rowH, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...TEXT_MID);
    doc.text(s.label, colLabel + 4, rowY + 2.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...TEXT_DARK);
    doc.text(s.value, colValue, rowY + 2.5);
  });

  // ── Price box ────────────────────────────────────────────────────────
  y = y + specs.length * rowH + 12;

  doc.setFillColor(...GOLD_BG);
  doc.roundedRect(14, y, tableW, 36, 4, 4, 'F');
  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, y, tableW, 36, 4, 4, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...SECONDARY);
  doc.text('PRECIO BASE DESDE', 20, y + 9);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(...SECONDARY);
  doc.text('S/ 130,900', 20, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...TEXT_MID);
  doc.text('Lote + Casa de 1 piso. Crédito preferencial FOVIME disponible.', 20, y + 31);

  // ── Ubicación ────────────────────────────────────────────────────────
  y = y + 46;

  doc.setTextColor(...SECONDARY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Ubicación', 14, y);
  doc.setDrawColor(...SECONDARY);
  doc.setLineWidth(0.5);
  doc.line(14, y + 2, 50, y + 2);

  y += 10;
  doc.setFillColor(240, 243, 250);
  doc.roundedRect(14, y, tableW, 20, 3, 3, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...TEXT_DARK);
  doc.text('Ctra. Panamericana Sur 52, Chilca 15871, Lima — Perú', 20, y + 8);
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MID);
  doc.text('A 52 km al sur de Lima, fácil acceso desde la Panamericana Sur.', 20, y + 15);

  // ── Footer ────────────────────────────────────────────────────────
  const footerY = 283;
  doc.setFillColor(...PRIMARY);
  doc.rect(0, footerY - 4, W, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Consorcio Neptuno', 14, footerY + 2);
  doc.setFont('helvetica', 'normal');
  doc.text('consorcio.neptuno.pe  |  WhatsApp disponible en nuestra web', 14, footerY + 7);
  doc.setTextColor(184, 200, 255);
  doc.setFontSize(7);
  doc.text('Documento informativo. Precios y especificaciones sujetos a cambio sin previo aviso.', 14, footerY + 12);

  doc.save('Ficha-Tecnica-Chavin-de-Huantar.pdf');
}
