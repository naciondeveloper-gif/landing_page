'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/features/admin/components/AdminNavbar';
import StatCards from '@/features/admin/components/StatCards';
import Dashboard from '@/features/admin/components/Dashboard';
import LotesTable from '@/features/admin/components/LotesTable';
import ReservasTable from '@/features/admin/components/ReservasTable';
import GestionUsuarios from '@/features/admin/components/GestionUsuarios';
import EstadoModal, { type CompradorData } from '@/features/admin/components/EstadoModal';
import CrearUsuarioModal from '@/features/admin/components/CrearUsuarioModal';
import { useAdminLotes } from '@/features/admin/hooks/useAdminLotes';
import type { Lote, EstadoLote } from '@/types/lote';

type Tab = 'dashboard' | 'lotes' | 'reservas' | 'usuarios';

interface Usuario {
  username: string;
  rol: string;
}

export default function AdminPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('reservas');
  const [modalLote, setModalLote] = useState<Lote | null>(null);
  const [modalCrearUsuario, setModalCrearUsuario] = useState(false);
  const [usuariosRefreshKey, setUsuariosRefreshKey] = useState(0);
  const router = useRouter();
  const { lotes, cargando, conteo, fetchDatos, cambiarEstado } = useAdminLotes();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userStorage = localStorage.getItem('user');
    if (!isLoggedIn) { router.replace('/login'); return; }
    if (userStorage) {
      try {
        const u: Usuario = JSON.parse(userStorage);
        setUsuario(u);
        setActiveTab('dashboard');
      } catch {}
    }
  }, [router]);

  const handleCambiarEstado = async (nuevoEstado: EstadoLote, comprador?: CompradorData) => {
    if (!modalLote) return;
    try {
      await cambiarEstado(modalLote, nuevoEstado, comprador);
      setModalLote(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar el estado.');
    }
  };

  if (cargando && !usuario) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        Cargando sistema...
      </div>
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50">
      <AdminNavbar
        username={usuario?.username ?? ''}
        rol={usuario?.rol ?? 'vendedor'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="px-4 sm:px-6 pt-20 pb-10 max-w-7xl mx-auto">
        {activeTab !== 'usuarios' && activeTab !== 'dashboard' && (
          <div className="mb-6">
            <StatCards conteo={conteo} />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard lotes={lotes} conteo={conteo} />
        )}

        {activeTab === 'lotes' && (
          <LotesTable lotes={lotes} onRefresh={fetchDatos} onEditEstado={setModalLote} />
        )}

        {activeTab === 'reservas' && (
          <ReservasTable lotes={lotes} onRefresh={fetchDatos} onEditEstado={setModalLote} />
        )}

        {activeTab === 'usuarios' && usuario?.rol === 'administrador' && (
          <GestionUsuarios
            usuarioActual={usuario}
            onCrearUsuario={() => setModalCrearUsuario(true)}
            refreshKey={usuariosRefreshKey}
          />
        )}
      </div>

      {modalLote && (
        <EstadoModal
          lote={modalLote}
          onClose={() => setModalLote(null)}
          onConfirm={handleCambiarEstado}
        />
      )}

      {modalCrearUsuario && (
        <CrearUsuarioModal
          onClose={() => setModalCrearUsuario(false)}
          onSuccess={() => {
            setModalCrearUsuario(false);
            setUsuariosRefreshKey(k => k + 1);
          }}
        />
      )}
    </section>
  );
}
