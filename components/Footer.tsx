export default function Footer() {
  return (
    <footer id="contacto" className="bg-blue-950 text-white py-12 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold text-lg mb-4">CONSORCIO NEPTUNO</h3>
          <p className="text-sm text-blue-200">Un hogar hecho para quienes protegen al país</p>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Enlaces</h3>
          <ul className="text-sm text-blue-200 space-y-2">
            <li>Mapa de Lotes</li>
            <li>Contacto</li>
            <li>Blog</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-lg mb-4">Contacto</h3>
          <p className="text-sm text-blue-200">WhatsApp: +51 924 888 889</p>
          <p className="text-sm text-blue-200">informes@consorcioneptuno.com</p>
        </div>
      </div>
      
      <div className="text-center text-xs text-blue-400 mt-12 border-t border-blue-900 pt-6">
        © 2026 Todos los derechos reservados.
      </div>
    </footer>
  );
}