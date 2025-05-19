import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { signIn, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Verificar se o usuário já está autenticado
  useEffect(() => {
    if (user) {
      // Redirecionar para a página principal ou página anterior
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from);
    }
  }, [user, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      console.log('Tentando login com:', email);
      const { error: loginError } = await signIn(email, password);
      
      if (loginError) {
        console.error('Erro de login:', loginError);
        
        // Traduzir as mensagens de erro comuns
        let errorMessage = loginError.message;
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Credenciais inválidas. Verifique seu email e senha.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Email não confirmado. Por favor, verifique sua caixa de entrada.';
        }
        
        setError(errorMessage || 'Falha ao fazer login. Verifique suas credenciais.');
      } else {
        console.log('Login bem-sucedido, redirecionando...');
        // O redirecionamento será tratado pelo useEffect quando o usuario for atualizado
      }
    } catch (err) {
      console.error('Erro não tratado durante login:', err);
      setError('Falha ao fazer login. Verifique suas credenciais.');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dashboard-background -z-10" />
      
      <motion.div 
        className="max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center">
          <div className="bg-primary-gradient p-2 rounded-full mb-6 shadow-glow">
            <motion.div 
              className="text-5xl flex items-center justify-center h-20 w-20"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.3,
                type: "spring",
                stiffness: 200
              }}
            >
              ⚡
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <span className="text-secondary-400 text-4xl font-bold">Solo</span>
          <span className="text-primary-400 text-4xl font-bold">Level</span>
        </div>
        
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Entre na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link to="/register" className="font-medium text-primary-400 hover:text-primary-300">
            cadastre-se gratuitamente
          </Link>
        </p>
      </motion.div>

      <motion.div 
        className="mt-8 max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="card">
          {error && (
            <div className="mb-6 bg-danger-light/30 border border-danger/30 text-danger px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 bg-card-light border border-white/10 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 flex justify-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Entrar
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Credenciais de teste: usuario@teste.com / senha123
            </p>
          </div>

          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-400">Novo por aqui?</span>
              </div>
            </div>

            <Link 
              to="/register" 
              className="mt-6 w-full inline-block btn-secondary py-3 text-center"
            >
              Registre-se e comece sua jornada
            </Link>
            
            <p className="mt-4 text-sm text-gray-400">
              Ao se registrar, você terá acesso ao formulário de anamnese para 
              personalizar sua experiência no SoloLevel.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login; 