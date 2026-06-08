export default function Ubicacion() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-container-max mx-auto px-4 md:px-16 text-center mb-12">
        <h2 className="text-headline-lg mb-4 text-on-surface">Ubicación Estratégica</h2>
        <p className="text-body-lg text-on-surface-variant">
          Encuéntranos en Chilca, un lugar de paz y crecimiento constante.
        </p>
      </div>

      <div className="w-full h-112.5 relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6550.506216602637!2d-76.73311148663709!3d-12.519186537428793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105767e3eb81c09%3A0x7f09f72bd592ab3a!2sCtra.%20Panamericana%20Sur%2052%2C%20Chilca%2015871!5e0!3m2!1ses-419!2spe!4v1780950726523!5m2!1ses-419!2spe"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación Conjunto Residencial Chavín de Huántar"
        />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container/90 backdrop-blur px-6 py-2 rounded-full border border-secondary/30 pointer-events-none">
          <p className="text-label-caps text-secondary">KM 52 PAN SUR – CHILCA, LIMA</p>
        </div>
      </div>
    </section>
  );
}
