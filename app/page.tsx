import Image from "next/image";
import { waLink } from "@/config/contacto";
import Nav          from "@/shared/components/layout/Navbar";
import Hero         from "@/features/landing/components/Hero";
import SocialProof  from "@/features/landing/components/SocialProof";
import Caracteristicas from "@/features/landing/components/Caracteristicas";
import ModeloVivienda  from "@/features/landing/components/ModeloVivienda";
import SobreProyecto   from "@/features/landing/components/SobreProyecto";
import Amenidades   from "@/features/landing/components/Amenidades";
import Brochure     from "@/features/landing/components/Brochure";
import Calculadora  from "@/features/landing/components/Calculadora";
import Ubicacion    from "@/features/landing/components/Ubicacion";
import FAQ          from "@/features/landing/components/FAQ";
import Footer       from "@/shared/components/layout/Footer";
import WhatsAppButton  from "@/features/landing/components/WhatsAppButton";
import MapaBase     from "@/features/mapa/components/MapaBase";

export default function Home() {
  return (
    <div id="inicio" className="bg-background">
      <Nav />
      <Hero />
      <SocialProof />
      <Caracteristicas />
      <ModeloVivienda />
      <SobreProyecto />
      <Ubicacion />
      <section id="mapa" className="py-24 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-4 md:px-16">
          <div className="text-center mb-12">
            <p className="text-label-caps text-secondary mb-2">Elige tu lote</p>
            <h2 className="text-headline-lg text-on-surface">Disponibilidad en Tiempo Real</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-4 rounded-3xl shadow-2xl min-h-150 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
              <div className="flex w-full justify-center items-center gap-4">
                <div className="hidden md:invisible">
                  Click para saber más
                </div>
                <div className="relative w-full max-w-4xl">
                  <Image src="/plano.svg" alt="Plano" width={3178} height={4460} className="w-full" />
                  <div>
                    <div className="absolute top-0 left-0 w-full h-full flex">
                      <MapaBase />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info card */}
            <div className="glass-card text-on-surface p-8 rounded-3xl shadow-xl sticky top-28">
              <h3 className="text-title-md mb-4 text-secondary">¿Listo para tu próximo hogar?</h3>
              <p className="text-on-surface-variant text-body-md mb-6">
                Selecciona un lote disponible en el plano para ver su estado en tiempo real.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-body-md">
                  <span className="w-4 h-4 bg-yellow-300 rounded-full shrink-0" /> Disponible
                </div>
                <div className="flex items-center gap-3 text-body-md">
                  <span className="w-4 h-4 bg-blue-500 rounded-full shrink-0" /> Reservado
                </div>
              </div>
              <a
                href={waLink('Hola, quiero información sobre un lote en Chavín de Huántar')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full whatsapp-gradient text-white font-bold py-3 rounded-xl transition-opacity hover:opacity-90 text-body-md"
              >
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <Calculadora />
      <Amenidades />
      <Brochure />
      <div id="faq"><FAQ /></div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
