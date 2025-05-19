import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, error: authError, loading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message || 'Credenciais inválidas. Use user@test.com / sololevel');
        return;
      }

      // Se não houve erro, o usuário está logado e será redirecionado no componente ProtectedRoute
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { error } = await signUp(email, password);
      
      if (error) {
        setError(error.message || 'Erro ao registrar. Tente novamente.');
        return;
      }

      // Redirecionar para o onboarding após registro bem-sucedido
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer registro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background-dark">
      {/* Overlay com gradiente e efeito de vidro */}
      <div className="absolute inset-0 bg-[url('/bg-login.jpg')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-glass-gradient opacity-90 z-0"></div>

      <div className="flex justify-center items-center px-4 z-10">
        <div className="bg-card/30 backdrop-blur-xl rounded-2xl p-8 lg:p-12 w-full max-w-md border border-gray-800 shadow-glass">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">SoloLevel</h1>
            <p className="text-gray-400 text-sm">
              {isRegistering ? 'Crie sua conta para começar sua evolução pessoal' : 'Entre para continuar sua evolução pessoal'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-lg bg-danger/20 border border-danger/30 text-white text-sm">
              {error}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
                  placeholder="Digite seu email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
                  placeholder="Digite sua senha"
                />
              </div>
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 bg-card border-gray-700 rounded text-info focus:ring-info/50"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-info hover:text-info/80">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-button text-sm font-medium text-white bg-primary-gradient hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info/50 transition duration-200"
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  isRegistering ? 'Registrar e Continuar' : 'Entrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {isRegistering 
                ? 'Já tem uma conta? ' 
                : 'Ainda não tem uma conta? '}
              <a 
                onClick={() => setIsRegistering(!isRegistering)} 
                className="font-medium text-info hover:text-info/80 cursor-pointer"
              >
                {isRegistering ? 'Entrar' : 'Registre-se'}
              </a>
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              Credenciais de teste: user@test.com / sololevel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 