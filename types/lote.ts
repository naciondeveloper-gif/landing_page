import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Reservacion {
  id?: string | number;
  lote_id?: string | number;
  nombre: string;
  telefono: string;
  correo?: string;
  mensaje?: string;
}

export interface Lote {
  id: string | number;
  numero: string | number;
  mz: string;
  area: string;
  disponible: boolean;
  d: string;
  type: string;
  reservado_hasta: Timestamp;
  reservaciones?: Reservacion[];
}