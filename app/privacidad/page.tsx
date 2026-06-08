import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad – Chavín de Huántar',
  description: 'Política de privacidad y tratamiento de datos del proyecto residencial Chavín de Huántar.',
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-secondary hover:underline text-sm mb-10"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Volver al inicio
        </Link>

        <h1 className="text-display-sm text-on-surface font-bold mb-2">
          Política de Privacidad
        </h1>
        <p className="text-body-md text-on-surface-variant mb-10">
          Última actualización: junio de 2026
        </p>

        <div className="space-y-8 text-on-surface-variant">

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">1. Responsable del tratamiento</h2>
            <p className="text-body-md leading-relaxed">
              <strong className="text-on-surface">Consorcio Neptuno</strong> es el responsable del
              tratamiento de los datos personales recopilados a través del sitio web del proyecto
              Chavín de Huántar, en cumplimiento de la Ley N.° 29733 – Ley de Protección de Datos
              Personales del Perú y su reglamento (D.S. 003-2013-JUS).
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">2. Datos que recopilamos</h2>
            <ul className="list-disc list-inside space-y-2 text-body-md leading-relaxed">
              <li>Nombre completo</li>
              <li>Número de teléfono / WhatsApp</li>
              <li>Dirección de correo electrónico</li>
              <li>Mensaje o consulta (si lo proporciona)</li>
              <li>Datos de navegación (cookies técnicas y analíticas)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">3. Finalidad del tratamiento</h2>
            <ul className="list-disc list-inside space-y-2 text-body-md leading-relaxed">
              <li>Atender su solicitud de información o reserva de lote.</li>
              <li>Contactarle a través de teléfono, WhatsApp o correo electrónico.</li>
              <li>Mejorar la experiencia del sitio web mediante análisis estadístico.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">4. Base legal</h2>
            <p className="text-body-md leading-relaxed">
              El tratamiento de sus datos se basa en el consentimiento otorgado al enviar el
              formulario de contacto o reserva, de conformidad con el artículo 13 de la Ley
              N.° 29733.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">5. Compartición de datos</h2>
            <p className="text-body-md leading-relaxed">
              Sus datos no serán vendidos ni cedidos a terceros ajenos al proyecto. Podrán ser
              compartidos con FOVIME y asesores comerciales autorizados de Consorcio Neptuno
              únicamente para los fines descritos en el punto 3.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">6. Conservación</h2>
            <p className="text-body-md leading-relaxed">
              Los datos serán conservados mientras exista una relación comercial activa o
              mientras la ley lo exija. Una vez finalizada la relación, serán eliminados de
              forma segura.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">7. Sus derechos</h2>
            <p className="text-body-md leading-relaxed">
              Conforme a la Ley N.° 29733, usted tiene derecho a acceder, rectificar, cancelar u
              oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, envíe
              su solicitud a{' '}
              <a href="mailto:informes@consorcioneptuno.com" className="text-secondary underline">
                informes@consorcioneptuno.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">8. Cookies</h2>
            <p className="text-body-md leading-relaxed">
              Este sitio utiliza cookies técnicas necesarias para su funcionamiento. Puede
              configurar su navegador para bloquearlas, aunque esto puede afectar algunas
              funcionalidades del sitio.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">9. Contacto</h2>
            <p className="text-body-md leading-relaxed">
              Para cualquier consulta sobre esta política, escríbenos a{' '}
              <a href="mailto:informes@consorcioneptuno.com" className="text-secondary underline">
                informes@consorcioneptuno.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
