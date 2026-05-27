export default function Hero() {
  return (
    <section id="inicio" className="relative w-full h-[80vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/house.jpg')] bg-cover bg-center opacity-40"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-3xl font-extrabold tracking-tight mb-6 flex flex-col justify-center">
          <span>Conjunto Residencial</span><span className="text-amber-500 text-7xl">Chavín de Huántar</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8">Exclusividad y tranquilidad para la familia militar.</p>
        <div className="flex gap-4 justify-center">
          <button className="bg-amber-600 hover:bg-foreground-700 text-white px-8 py-3 rounded-full font-bold transition-all" >
            Ver disponibilidad
          </button>
        </div>
      </div>
    </section>
  );
}