import { waLink, EMAIL, WHATSAPP_DISPLAY, DIRECCION } from '@/config/contacto';

export default function Footer() {
  return (
    <footer id="contacto" className="w-full bg-linear-20 to-surface-tint/30 from-on-secondary border-t border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-4 md:px-16 py-12 md:py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-secondary rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px]" />
        </div>
        <h2 className="text-headline-lg md:text-display-lg text-on-surface mb-6">¿Listo para dar el primer paso?</h2>
        <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
          Tu nuevo hogar en Chavín de Huántar te espera. Consulta disponibilidad y planes de financiamiento preferenciales.
        </p>
        <a
          href={waLink('Hola, quiero información sobre Chavín de Huántar')}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 whatsapp-gradient px-8 py-4 rounded-xl text-title-md text-white hover:opacity-90 transition-all gold-glow group"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
          Escribir por WhatsApp
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </div>

      {/* Main links & info */}
      <div className="max-w-container-max mx-auto px-4 md:px-16 py-12 border-t border-outline-variant/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Brand */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <img src="/fovime-logo.png"  alt="FOVIME" className="h-10 w-auto opacity-90" />
              <div className="w-px h-8 bg-outline-variant" />
              <img src="/neptuno-logo.png" alt="Consorcio Neptuno" className="h-10 w-auto opacity-90" />
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Chavín de Huántar es un conjunto residencial ubicado en el KM 52 Panamericana Sur — Chilca. Un proyecto exclusivo de Consorcio Neptuno y FOVIME para la familia militar peruana.
            </p>
            <div className="flex gap-4">
              {['face_nod', 'photo_camera', 'play_circle'].map((icon) => (
                <a key={icon} href="#" className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary hover:bg-secondary hover:text-on-secondary transition-colors">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Proyecto links */}
          <div className="md:col-span-2 md:ml-auto">
            <h3 className="text-title-md text-on-surface mb-6 uppercase tracking-wider">Proyecto</h3>
            <ul className="space-y-4">
              {[['#inicio','Inicio'],['#nosotros','El Proyecto'],['#mapa','Planos'],['#mapa','Mapa de Lotes'],['#contacto','Galería']].map(([href, label]) => (
                <li key={label}><a href={href} className="text-on-surface-variant hover:text-secondary transition-colors text-body-md">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Soporte links */}
          <div className="md:col-span-2">
            <h3 className="text-title-md text-on-surface mb-6 uppercase tracking-wider">Soporte</h3>
            <ul className="space-y-4">
              {['Privacidad','Términos','Preguntas Frecuentes','Libro de Reclamaciones'].map((label) => (
                <li key={label}><a href="#" className="text-on-surface-variant hover:text-secondary transition-colors text-body-md">{label}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-title-md text-on-surface mb-6 uppercase tracking-wider">Contacto Directo</h3>
            <div className="space-y-4">
              {[
                { icon: 'location_on',  title: 'Ubicación',           content: DIRECCION,          href: undefined },
                { icon: 'mail',         title: 'Correo',              content: EMAIL,               href: `mailto:${EMAIL}` },
                { icon: 'phone_iphone', title: 'Teléfono / WhatsApp', content: WHATSAPP_DISPLAY,    href: waLink() },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-secondary mt-1">{item.icon}</span>
                  <div>
                    <p className="text-on-surface font-semibold text-body-md">{item.title}</p>
                    {item.href
                      ? <a href={item.href} className="text-on-surface-variant hover:text-secondary text-body-md">{item.content}</a>
                      : <p className="text-on-surface-variant text-body-md">{item.content}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="w-full bg-surface-container-low py-8">
        <div className="max-w-container-max mx-auto px-4 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-body-md text-on-surface-variant">
            © 2026 Chavín de Huántar. Todos los derechos reservados. Un proyecto de{' '}
            <span className="text-secondary font-semibold">Consorcio Neptuno</span> y{' '}
            <span className="text-secondary font-semibold">FOVIME</span>.
          </p>
          <div className="flex items-center gap-6 text-on-surface-variant text-body-md">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">shield</span> Proyecto Verificado
            </span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">verified</span> Exclusivo Familia Militar
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
}
