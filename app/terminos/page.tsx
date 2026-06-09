import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones – Chavín de Huántar',
  description: 'Términos y condiciones del proyecto residencial Chavín de Huántar.',
};

export default function TerminosPage() {
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
          Términos y Condiciones
        </h1>
        <p className="text-body-md text-on-surface-variant mb-10">
          Última actualización: junio de 2026
        </p>

        <div className="prose prose-neutral max-w-none text-on-surface-variant space-y-8">

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">1. Aceptación</h2>
            <p className="text-body-md leading-relaxed">
              Al acceder o usar este sitio web y/o al solicitar información sobre el proyecto
              residencial <strong className="text-on-surface">Chavín de Huántar</strong>, usted
              acepta los presentes Términos y Condiciones en su totalidad. Si no está de acuerdo
              con alguno de los términos, le pedimos que no continúe utilizando el sitio ni envíe
              formularios de reserva.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">2. Sobre el proyecto</h2>
            <p className="text-body-md leading-relaxed">
              Chavín de Huántar es un conjunto residencial desarrollado por{' '}
              <strong className="text-on-surface">Consorcio Neptuno</strong> y{' '}
              <strong className="text-on-surface">FOVIME</strong>, ubicado en el KM 52
              Panamericana Sur, Lima. El acceso al crédito preferencial está sujeto a los
              requisitos establecidos por FOVIME y es exclusivo para el personal de la familia
              militar peruana y sus beneficiarios.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">3. Reserva de lotes</h2>
            <ul className="list-disc list-inside space-y-2 text-body-md leading-relaxed">
              <li>
                La solicitud de reserva enviada a través del formulario del mapa interactivo
                <strong className="text-on-surface"> no constituye contrato de compraventa</strong>,
                sino una expresión de interés.
              </li>
              <li>
                Un asesor se pondrá en contacto dentro de las{' '}
                <strong className="text-on-surface">24 horas hábiles</strong> siguientes para
                confirmar disponibilidad y condiciones.
              </li>
              <li>
                La separación efectiva del lote requiere la firma del contrato correspondiente y
                el pago de la cuota inicial estipulada por Consorcio Neptuno.
              </li>
              <li>
                La disponibilidad mostrada en el plano es referencial y puede cambiar sin previo
                aviso.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">4. Datos personales</h2>
            <p className="text-body-md leading-relaxed">
              Los datos ingresados en los formularios (nombre, teléfono, correo) serán usados
              exclusivamente para contactarle con información sobre el proyecto. Para más detalles
              consulte nuestra{' '}
              <Link href="/privacidad" className="text-secondary underline">
                Política de Privacidad
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">5. Precios e información</h2>
            <p className="text-body-md leading-relaxed">
              Los precios, metrajes y características mostrados son referenciales y pueden estar
              sujetos a cambios. La información definitiva será entregada por un asesor autorizado
              de Consorcio Neptuno al momento de la atención comercial.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">6. Propiedad intelectual</h2>
            <p className="text-body-md leading-relaxed">
              Todos los contenidos del sitio (textos, imágenes, planos, logotipos) son propiedad
              de Consorcio Neptuno y/o FOVIME. Queda prohibida su reproducción total o parcial
              sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">7. Modificaciones</h2>
            <p className="text-body-md leading-relaxed">
              Consorcio Neptuno se reserva el derecho de modificar estos Términos en cualquier
              momento. Los cambios entran en vigor desde su publicación en este sitio.
            </p>
          </section>

          <section>
            <h2 className="text-title-lg text-on-surface font-semibold mb-3">8. Contacto</h2>
            <p className="text-body-md leading-relaxed">
              Para consultas sobre estos términos, escríbenos a{' '}
              <a href="mailto:informes@consorcioneptuno.com" className="text-secondary underline">
                informes@consorcioneptuno.com
              </a>{' '}
              o contáctanos por WhatsApp al{' '}
              <a href="https://wa.me/51924888889" className="text-secondary underline">
                924 888 889
              </a>
              .
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
