import Image from 'next/image';

export default function SobreProyecto() {
  return (
    <section id="nosotros" className="bg-gray-50 py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-80 md:h-115">
          <Image
            src="/house.jpg"
            alt="Conjunto Residencial Chavín de Huántar"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-blue-950/90 to-transparent p-6">
            <p className="text-white font-bold text-lg">Conjunto Residencial Chavín de Huántar</p>
            <p className="text-blue-200 text-sm">KM 52 Panamericana Sur – Lima</p>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-amber-500 font-bold text-xs tracking-[0.2em] uppercase mb-3">El Respaldo</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight mb-6">
            El respaldo que solo <span className="text-amber-500">FOVIME</span> puede darte
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Consorcio Neptuno y FOVIME se unen para ofrecerte facilidades de pago y crédito preferencial, pensado exclusivamente para miembros de las Fuerzas Armadas y sus familias.
          </p>

          <div className="space-y-3 mb-10">
            {[
              'Crédito hipotecario preferencial a través de FOVIME',
              'Cuotas accesibles ajustadas a tu capacidad de pago',
              'Asesoría personalizada durante todo el proceso',
              'Escritura pública registrada desde el primer día',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold shrink-0">✓</span>
                <p className="text-gray-700 font-medium text-sm">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-blue-950 text-white rounded-2xl px-5 py-3">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-amber-400 shrink-0">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
              <div>
                <p className="text-xs text-blue-300">En alianza con</p>
                <p className="font-bold text-sm">FOVIME</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
              <span className="text-xl">🇵🇪</span>
              <div>
                <p className="text-xs text-gray-500">Para la</p>
                <p className="font-bold text-sm text-blue-950">Familia Militar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
