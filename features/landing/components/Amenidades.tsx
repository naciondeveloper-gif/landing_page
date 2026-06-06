const enTuHogar = [
  { icon: 'grass',                 label: 'Patio Trasero Privado' },
  { icon: 'local_florist',         label: 'Jardín de Ingreso' },
  { icon: 'local_laundry_service', label: 'Lavandería' },
  { icon: 'chair',                 label: 'Sala de Estar' },
  { icon: 'stairs',                label: 'Proyección a 2.° Piso' },
];

const enElCondominio = [
  { icon: 'park',          label: 'Áreas Verdes y Parques Temáticos' },
  { icon: 'sports_soccer', label: 'Canchas Deportivas' },
  { icon: 'toys',          label: 'Juegos Infantiles' },
  { icon: 'water',         label: 'Cascada Ornamental' },
  { icon: 'home_work',     label: 'Pórtico de Ingreso' },
  { icon: 'security',      label: 'Seguridad 24/7' },
];

function AmenidadCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 flex flex-col items-center text-center gap-3 hover:bg-white/20 hover:border-secondary/60 transition-all group cursor-default">
      <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <p className="text-body-md text-white font-medium leading-tight">{label}</p>
    </div>
  );
}

export default function Amenidades() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/detalles-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/88" />
      </div>

      <div className="relative z-10 max-w-container-max mx-auto px-4 md:px-16">
        <div className="text-center mb-16">
          <p className="text-label-caps text-secondary mb-3">Lo que incluye el proyecto</p>
          <h2 className="text-headline-lg text-white mb-4">Áreas Comunes y Amenidades</h2>
          <p className="text-body-lg text-white/70 max-w-2xl mx-auto">
            Espacios pensados para el disfrute de toda la familia, tanto dentro de tu hogar como en el condominio.
          </p>
        </div>

        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <h3 className="text-title-md text-secondary uppercase tracking-wider">En tu hogar</h3>
              <div className="flex-1 h-px bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {enTuHogar.map((a) => <AmenidadCard key={a.label} {...a} />)}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>apartment</span>
              <h3 className="text-title-md text-secondary uppercase tracking-wider">En el condominio</h3>
              <div className="flex-1 h-px bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {enElCondominio.map((a) => <AmenidadCard key={a.label} {...a} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
