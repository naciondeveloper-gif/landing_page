import Image from "next/image";
import Hero from "../components/Hero"
import MapaBase from "@/components/Mapa/MapaBase";
import Nav from "../components/Navbar"

export default function Home() {
  return (
    <div>
      <Nav></Nav>
      <Hero></Hero>
      <section id="mapa" className="py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-blue-950 mb-12 text-center">
              Disponibilidad y Lotes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-4 rounded-3xl shadow-2xl min-h-150 flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden">
              <div className="flex w-full justify-center items-center gap-4">
                <div className="hidden md:visible">
                  Click para saber más
                </div>
                <div className="relative w-full max-w-4xl">
                  <Image 
                    src="/plano.jpg" 
                    alt="Plano" 
                    width={3178} 
                    height={4460} 
                    className="w-full"
                  />
                  <div>
                    <div className="absolute top-0 left-0 w-full h-full flex">
                      <MapaBase />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-950 text-white p-8 rounded-3xl shadow-xl sticky top-28">
              <h3 className="text-2xl font-bold mb-4 text-amber-500">¿Listo para tu próximo hogar?</h3>
              <p className="text-gray-300 mb-6">
                Selecciona un lote en el plano para ver el estado de disponibilidad en tiempo real.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-4 h-4 bg-yellow-300 rounded-full"></span> Disponible
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span> Reservado
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}