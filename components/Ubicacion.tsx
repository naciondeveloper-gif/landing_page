export default function Ubicacion() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-4 md:px-16 text-center mb-12">
        <h2 className="text-headline-lg mb-4 text-on-surface">Ubicación Estratégica</h2>
        <p className="text-body-lg text-on-surface-variant">
          Encuéntranos en Chilca, un lugar de paz y crecimiento constante.
        </p>
      </div>

      <div className="w-full h-[400px] relative overflow-hidden">
        <img
          src="/stitch/map-chincha.jpg"
          alt="Mapa Chilca – KM 52 Panamericana Sur"
          className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <a
            href="https://maps.google.com/?q=KM+52+Panamericana+Sur+Chilca+Peru"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-container p-6 rounded-xl border-2 border-secondary gold-glow animate-bounce hover:animate-none hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined text-secondary text-4xl">location_on</span>
          </a>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container/90 backdrop-blur px-6 py-2 rounded-full border border-secondary/30">
          <p className="text-label-caps text-secondary">KM 52 PAN SUR – CHILCA, LIMA</p>
        </div>
      </div>
    </section>
  );
}
