import { Timestamp } from "next/dist/server/lib/cache-handlers/types";

export interface Lote {
  id: string | number;
  numero: string | number;
  area: string;
  disponible: boolean;
  d: string;
  type: string;
  reservado_hasta: Timestamp;
}