import type { EstadoLote } from '@/types/lote';

type EstadoConfig = { label: string; color: string; bg: string; icon: string };

export const ESTADO_CONFIG: Record<EstadoLote, EstadoConfig> = {
  disponible: { label: 'Disponible', color: 'text-green-700', bg: 'bg-green-100', icon: 'check_circle' },
  separado:   { label: 'Separación', color: 'text-amber-700', bg: 'bg-amber-100', icon: 'schedule'     },
  vendido:    { label: 'Vendido',    color: 'text-red-700',   bg: 'bg-red-100',   icon: 'sell'         },
};
