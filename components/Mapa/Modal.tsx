import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Lote {
  id: string | number;
  numero: string | number;
  area: string;
  disponible: boolean;
  d: string;
  type: string;
}

interface ModalProps {
  lote: Lote;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ lote, isOpen, onClose }: ModalProps) {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: ''
  });
  
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Datos listos para enviar:", formData);
    console.log("Lote de interés:", lote.numero);
    setEnviado(true);

    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: '', telefono: '', correo: '', mensaje: '' });
      onClose();
    }, 3000);
  };

  return (
    <motion.div 
        initial ={{opacity: 0}}
        animate = {{opacity: 1}}
        exit={{opacity: 0}}
        className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-md w-full relative">
            <button
              onClick={onClose}
              className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
            {lote.disponible ? (
              <div>
                <h2 className="text-2xl font-bold mb-1 text-blue-950">Lote {lote.numero}</h2>
                <p className="mb-6 text-gray-600 text-sm">
                  Este lote de <strong>{lote.area}</strong> está disponible. Déjanos tus datos y un asesor te contactará.
                  <strong> Recuerda que esta reserva es válida por solo 24 horas.</strong>
                </p>

                {enviado ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center font-medium animate-fade-in-up">
                    ¡Gracias! Hemos recibido tus datos. Te contactaremos muy pronto.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                      <input
                        required
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ingrese su nombre..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                        <input
                          required
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleChange}
                          placeholder="Ej. 555 123 4567"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correo (Opcional)</label>
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          placeholder="correo@ejemplo.com"
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje (Opcional)</label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={2}
                        placeholder="¿Tienes alguna duda en particular sobre este lote?"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-950 hover:bg-blue-800 transition-colors text-white font-bold py-3 rounded-lg mt-2 shadow-md hover:shadow-lg"
                    >
                      Solicitar Información
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                  !
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lote no disponible</h2>
                <p className="text-gray-600">Lo sentimos, el Lote {lote.numero} ya ha sido vendido o se encuentra reservado.</p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-lg transition-colors"
                >
                  Ver otros lotes
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}