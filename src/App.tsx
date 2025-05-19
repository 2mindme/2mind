import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PhysicalPage from './pages/PhysicalPage';
import QuestsPage from './pages/QuestsPage';
import SkillsPage from './pages/SkillsPage';
import StorePage from './pages/StorePage';
import LeaderboardPage from './pages/LeaderboardPage';
import RoutinePage from './pages/RoutinePage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { isFirstLogin } from './lib/supabase';
import ModalProvider from './context/ModalContext';

// Componente para rotas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Componente para verificar se o usuário precisa fazer onboarding
const OnboardingCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (user && !loading && profile) {
        // Verificar se o usuário já completou o onboarding
        if (!profile.has_completed_onboarding && location.pathname !== '/onboarding') {
          navigate('/onboarding');
        }
      }
    };

    checkOnboarding();
  }, [user, loading, profile, navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return <>{children}</>;
};

// Componente temporário para páginas em construção
const UnderConstruction: React.FC<{ pageName: string }> = ({ pageName }) => {
  return (
    <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col items-center justify-center">
      <svg className="w-24 h-24 text-info mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
      </svg>
      <h2 className="text-2xl font-bold text-white mb-2">{pageName} em Construção</h2>
      <p className="text-gray-400 text-center">Esta página está sendo desenvolvida e em breve estará disponível.</p>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <div className="min-h-screen bg-background-dark font-['DM_Sans']">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              {/* Rota de onboarding pode ser acessada sem autenticação se usuário tiver registro parcial */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <OnboardingPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rotas protegidas com o Layout */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <OnboardingCheck>
                      <Layout />
                    </OnboardingCheck>
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="rotina" element={<RoutinePage />} />
                <Route path="missoes" element={<QuestsPage />} />
                <Route path="habilidades" element={<SkillsPage />} />
                <Route path="fisico" element={<PhysicalPage />} />
                <Route path="loja" element={<StorePage />} />
                <Route path="classificacao" element={<LeaderboardPage />} />
                <Route path="perfil" element={<ProfilePage />} />
              </Route>
              
              {/* Redirecionar outras rotas para o dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App; 