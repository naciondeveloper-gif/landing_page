import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <div className="text-2xl font-bold text-blue-900">
          Consorcio Neptuno
        </div>

        <div className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600">Inicio</Link>
          <Link href="#proyecto" className="hover:text-blue-600">Proyecto</Link>
          <Link href="#mapa" className="hover:text-blue-600">Mapa Interactivo</Link>
        </div>

        <Link 
          href="/login" 
          className="bg-blue-900 text-white px-6 py-2.5 rounded-full hover:bg-blue-800 transition-colors font-semibold"
        >
          Iniciar Sesión
        </Link>
      </div>
    </nav>
  );
}