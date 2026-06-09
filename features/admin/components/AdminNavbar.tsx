'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tab = 'dashboard' | 'lotes' | 'reservas' | 'usuarios';

interface Props {
  username: string;
  rol: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function AdminNavbar({ username, rol, activeTab, onTabChange }: Props) {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.replace('/login');
  };

  const tabs: { key: Tab; label: string; icon: string; onlyAdmin?: boolean }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'dashboard'                       },
    { key: 'lotes',     label: 'Lotes',     icon: 'grid_view'                       },
    { key: 'reservas',  label: 'Reservas',  icon: 'event_available'                 },
    { key: 'usuarios',  label: 'Usuarios',  icon: 'group',          onlyAdmin: true },
  ];

  const visibleTabs = tabs.filter(t => !t.onlyAdmin || rol === 'administrador');

  return (
    <div className="w-full bg-white fixed top-0 h-14 flex px-4 justify-between items-center shadow-sm border-b border-gray-200 z-40">
      {/* Logo + Tabs */}
      <div className="flex items-center gap-4 h-full">
        <Link
          href="/"
          className="text-white font-bold bg-blue-950 w-9 h-9 flex items-center justify-center text-sm rounded-full hover:bg-blue-800 transition-colors shrink-0"
        >
          N
        </Link>

        <nav className="flex items-center h-full gap-1">
          {visibleTabs.map(t => (
            <button
              key={t.key}
              onClick={() => onTabChange(t.key)}
              className={`flex items-center gap-1.5 px-3 h-full text-sm font-semibold border-b-2 transition-colors ${
                activeTab === t.key
                  ? 'border-blue-950 text-blue-950'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: activeTab === t.key ? "'FILL' 1" : "'FILL' 0" }}>
                {t.icon}
              </span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User info + logout */}
      <div className="flex gap-3 items-center">
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 pr-3 border-r border-gray-200">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
          <div className="leading-tight">
            <p className="text-xs font-semibold text-gray-700">{username}</p>
            <p className="text-xs text-gray-400 capitalize">{rol === 'administrador' ? 'Administrador' : 'Vendedor'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs text-white transition-colors"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
