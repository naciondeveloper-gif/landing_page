import Link from 'next/link';
export default function Hero() {
  return (
    <section className="relative w-full h-[50vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden mt-20">
      <div className="absolute inset-0 bg-[url('/terrenos.png')] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-6 flex flex-col justify-center">
          <span>Conjunto Residencial</span><span className="text-amber-500 text-7xl">Chavín de Huántar</span>
        </h1>
        <p className="text-md md:text-md mb-8">Exclusividad y tranquilidad para la familia militar.</p>
        <div className="flex gap-4 justify-center">
          <Link href={"#mapa"} className="bg-amber-600 hover:bg-foreground-700 text-white px-8 py-3 rounded-full font-bold transition-all" >
            Ver disponibilidad
          </Link>
        </div>
      </div>
    </section>
  );
}