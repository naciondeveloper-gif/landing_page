import { ESTADO_CONFIG } from '@/config/estados';
import type { EstadoLote } from '@/types/lote';

interface Props {
  conteo: Record<EstadoLote, number>;
}

export default function StatCards({ conteo }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {(Object.entries(conteo) as [EstadoLote, number][]).map(([key, n]) => {
        const cfg = ESTADO_CONFIG[key];
        return (
          <div key={key} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${cfg.bg} rounded-full flex items-center justify-center`}>
                <span
                  className={`material-symbols-outlined ${cfg.color}`}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {cfg.icon}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{n}</p>
                <p className="text-[10px] md:text-xs text-gray-400">{cfg.label}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
