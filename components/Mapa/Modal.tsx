interface Lote {
  numero: string | number;
  disponible: boolean;
  type: string;
}

interface ModalProps {
  lote: Lote;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ lote, isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full">
        {lote.disponible ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">Lote {lote.numero}</h2>
              <p className="mb-4">Está disponible. ¡Contáctanos!</p>
              <input placeholder="Nombre" className="w-full mb-2 p-2 border rounded" />
              <button className="w-full bg-blue-900 text-white py-2 rounded">Enviar</button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">¡Ups!</h2>
              <p>Este lote ya fue vendido.</p>
            </div>
          )}
        <button onClick={onClose} className="mt-4 text-gray-400">Cerrar</button>
      </div>
    </div>
  );
}