export interface Reservacion {
  id?: string | number;
  lote_id?: string | number;
  nombre: string;
  telefono: string;
  correo?: string;
  mensaje?: string;
  created_at?: string;
}

export type EstadoLote = 'disponible' | 'separado' | 'vendido';

export interface Lote {
  id: string | number;
  numero: string | number;
  mz: string;
  area: string;
  disponible: boolean;
  estado: EstadoLote;
  precio: number;
  d: string;
  type: string;
  reservado_hasta: string | null;
  reservaciones?: Reservacion[];
}
