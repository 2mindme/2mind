import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    
    try {
      const { error: registerError } = await register(username, email, password);
      
      if (registerError) {
        console.error('Erro retornado pelo registro:', registerError);
        setError(registerError.message || 'Falha ao criar conta. Tente novamente.');
        return;
      }
      
      // Registro bem-sucedido
      setSuccess('Conta criada com sucesso! Você será redirecionado para o login em alguns segundos...');
      
      // Limpar o formulário
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Erro não tratado durante o registro:', err);
      setError('Falha ao criar conta. Tente novamente.');
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
          <div className="bg-secondary-gradient p-2 rounded-full mb-6 shadow-glow">
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
              🚀
            </motion.div>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <span className="text-secondary-400 text-4xl font-bold">Solo</span>
          <span className="text-primary-400 text-4xl font-bold">Level</span>
        </div>
        
        <h2 className="mt-4 text-center text-3xl font-extrabold text-white">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link to="/login" className="font-medium text-primary-400 hover:text-primary-300">
            entre em uma conta existente
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
          
          {success && (
            <div className="mb-6 bg-success-light/30 border border-success/30 text-success px-4 py-3 rounded-xl">
              {success}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Nome de usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="seunome"
              />
            </div>
            
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">A senha deve ter pelo menos 6 caracteres</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="flex items-center">
              <div className="bg-card-light/50 rounded-lg p-1">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="hidden"
                />
                <label htmlFor="terms" className="flex items-start px-3 py-2 rounded-lg cursor-pointer text-gray-300 hover:bg-card transition-all">
                  <span className="h-5 w-5 border border-white/20 rounded-md mr-2 flex-shrink-0 flex items-center justify-center">
                    ✓
                  </span>
                  <span className="text-sm">
                    Eu concordo com os{' '}
                    <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                      Termos de Serviço
                    </a>{' '}
                    e{' '}
                    <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                      Política de Privacidade
                    </a>
                  </span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full btn-secondary py-3 flex justify-center"
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {success ? 'Registrado' : 'Cadastrar-se'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-gray-400">Ou continue com</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="#"
                className="w-full inline-flex justify-center py-3 px-4 border border-white/10 rounded-xl shadow-sm bg-card-light text-sm font-medium text-gray-300 hover:bg-card transition-colors"
              >
                <span className="sr-only">Continuar com Google</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </a>

              <a
                href="#"
                className="w-full inline-flex justify-center py-3 px-4 border border-white/10 rounded-xl shadow-sm bg-card-light text-sm font-medium text-gray-300 hover:bg-card transition-colors"
              >
                <span className="sr-only">Continuar com Facebook</span>
                <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register; 