const cards = [
  { icon: 'home',        title: 'CASAS DE 1 PISO',   desc: 'Con proyección a 2 pisos para tu crecimiento futuro.' },
  { icon: 'square_foot', title: 'ÁREA DE TERRENO',   desc: 'Diseñados con amplitud para la comodidad de toda tu familia.' },
  { icon: 'architecture',title: 'ÁREA TECHADA',      desc: 'Construcción eficiente con materiales de primera calidad.' },
  { icon: 'park',        title: 'ÁREAS VERDES',      desc: 'Juegos y espacios recreativos para toda la familia.' },
];

export default function Caracteristicas() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-container-max mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="glass-card p-8 rounded-xl flex flex-col items-center text-center group hover:border-secondary/40 transition-all"
            >
              <div className="w-16 h-16 rounded-xl bg-primary-container border border-secondary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-secondary text-4xl">{c.icon}</span>
              </div>
              <h3 className="text-title-md mb-2 text-on-surface">{c.title}</h3>
              <p className="text-body-md text-on-surface-variant">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
