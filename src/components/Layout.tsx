import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const sidebarLinks = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    to: '/rotina',
    label: 'Rotina',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/fisico',
    label: 'Físico',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    to: '/missoes',
    label: 'Missões',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    to: '/habilidades',
    label: 'Habilidades',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    to: '/classificacao',
    label: 'Classificação',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    to: '/loja',
    label: 'Loja',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-20 h-full flex flex-col items-center bg-sidebar shadow-xl transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-56' : 'w-16'}`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-center h-16 border-b border-gray-800 w-full ${isSidebarOpen ? '' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <span className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white tracking-tight select-none">2mind</span>
              {/* Logo: 2 estilizado como cérebro */}
              <svg className="w-8 h-8 text-info" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Base do 2 */}
                <path d="M8 8C8 8 12 4 16 8C20 12 16 16 16 16H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Detalhes do cérebro */}
                <path d="M10 10C10 10 12 8 14 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 12C10 12 12 10 14 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 14C10 14 12 12 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          ) : (
            <svg className="w-8 h-8 text-info" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Base do 2 */}
              <path d="M8 8C8 8 12 4 16 8C20 12 16 16 16 16H8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Detalhes do cérebro */}
              <path d="M10 10C10 10 12 8 14 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 12C10 12 12 10 14 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14C10 14 12 12 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        {/* User Info */}
        {isSidebarOpen && (
          <div className="p-4 border-b border-gray-800 w-full">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-300 font-medium">{profile?.name || user?.email?.split('@')[0] || 'Usuário'}</div>
                <div className="text-xs text-gray-500">Nível {profile?.level || 1}</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>XP</span>
                <span>{profile?.experience || 0}/100</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-info h-1.5 rounded-full"
                  style={{ width: `${profile?.experience || 0}%` }}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs text-yellow-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>{profile?.currency || 0} Moedas</span>
            </div>
          </div>
        )}
        {/* Sidebar Menu */}
        <nav className={`flex-1 flex flex-col items-center py-6 w-full`}>
          <ul className="flex flex-col gap-2 w-full items-center">
            {sidebarLinks.map((link) => (
              <li key={link.to} className="w-full flex justify-center">
                <Link
                  to={link.to}
                  className={`flex items-center w-12 h-12 rounded-lg transition-all duration-300 ease-in-out overflow-hidden ${
                    location.pathname === link.to
                      ? 'bg-info/10 text-info font-medium'
                      : 'hover:bg-gray-800 text-gray-300'
                  } ${isSidebarOpen ? 'justify-start pl-4 w-48 text-left' : 'justify-center'}`}
                  title={link.label}
                >
                  <span className="flex items-center justify-center text-xl transition-all duration-300 ease-in-out">{link.icon}</span>
                  <span
                    className={`ml-4 text-base whitespace-nowrap transition-all duration-300 ease-in-out ${
                      isSidebarOpen ? 'opacity-100 translate-x-0 relative' : 'opacity-0 -translate-x-4 absolute'
                    }`}
                    style={{ pointerEvents: isSidebarOpen ? 'auto' : 'none' }}
                  >
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Sidebar Footer */}
        <div className="w-full flex justify-center items-end pb-4 mt-auto">
          <button
            onClick={toggleSidebar}
            className="bg-info text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-30"
            title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isSidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300`} style={{ marginLeft: isSidebarOpen ? '14rem' : '4rem' }}>
        {/* Header */}
        <header className="bg-sidebar backdrop-blur-sm h-16 shadow-md flex items-center px-6 border-b border-gray-800">
          {/* Mobile menu button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden mr-4 text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page Title */}
          <h1 className="text-lg font-medium text-white ml-2">
            {sidebarLinks.find((link) => link.to === location.pathname)?.label ||
              (location.pathname === '/perfil' ? 'Perfil' : 'Dashboard')}
          </h1>

          {/* Right Side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-400 hover:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
            {/* Botão de sair ao lado das notificações */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 focus:outline-none"
              title="Sair"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            {/* User Menu */}
            <Link to="/perfil" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background-dark p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 