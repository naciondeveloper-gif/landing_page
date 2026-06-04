export default function ConoceMas() {
  return (
    <section id="nosotros" className="py-24 military-gradient">
      <div className="max-w-container-max mx-auto px-4 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text blocks */}
          <div className="space-y-12">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 shrink-0 rounded-full border-2 border-secondary flex items-center justify-center gold-glow">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>landscape</span>
              </div>
              <div>
                <h2 className="text-headline-lg mb-4 text-on-surface">
                  UN ENTORNO DISEÑADO PARA EL BIENESTAR DE TU FAMILIA
                </h2>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  Espacios amplios, áreas verdes y una comunidad organizada donde tus hijos crecen seguros y tú descansas con verdadera tranquilidad.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 shrink-0 rounded-full border-2 border-secondary flex items-center justify-center gold-glow">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
              </div>
              <div>
                <h3 className="text-headline-lg mb-4 text-secondary">
                  A 52 KM DE LIMA, CONECTADO CON TODO
                </h3>
                <p className="text-body-lg text-on-surface-variant leading-relaxed">
                  Acceso directo por la Panamericana Sur — Chilca, Lima. Cerca de colegios, centros de salud y comercios, sin perder la comodidad de vivir alejado del ruido de la ciudad.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 bg-secondary/10 rounded-2xl blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-secondary/30 shadow-2xl aspect-video group">
              <img
                src="/stitch/gated-entry.jpg"
                alt="Entrada Conjunto Residencial Chavín de Huántar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                <p className="text-white text-title-md italic">
                  Conjunto Residencial Chavín de Huántar — KM 52 Pan. Sur, Chilca, Lima
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
