import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getUserProfile, getUserTasks, completeQuest, createUserTask } from '../lib/supabase';
import { Task } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  tasks: Task[];
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, needsOnboarding?: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  register: (username: string, email: string, password: string) => Promise<{ error: any, needsOnboarding?: boolean }>;
  completeTask: (taskId: string) => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => Promise<{ data: Task | null, error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obter a sessão atual quando o componente é montado
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchTasks(session.user.id);
      }
      setLoading(false);
    });

    // Configurar um listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchTasks(session.user.id);
      } else {
        setProfile(null);
        setTasks([]);
      }
      setLoading(false);
    });

    // Limpar o listener quando o componente é desmontado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await getUserProfile(userId);
      if (error) {
        throw error;
      }
      setProfile(data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const fetchTasks = async (userId: string) => {
    try {
      const { data, error } = await getUserTasks(userId);
      if (error) {
        throw error;
      }
      setTasks(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar tarefas:", error);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Atualizar o estado das tarefas localmente para feedback imediato
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, completed: true, completedAt: new Date().toISOString() } 
            : task
        )
      );
      
      // Chamar a API para realmente completar a tarefa
      const { error } = await completeQuest(user.id, taskId);
      
      if (error) {
        throw error;
      }
      
      // Recarregar perfil e tarefas para garantir dados atualizados
      await fetchProfile(user.id);
      await fetchTasks(user.id);
    } catch (error: any) {
      setError(error.message);
      // Reverter o estado local se a operação falhar
      await fetchTasks(user.id);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        throw error;
      }

      // Se o registro for bem-sucedido, crie um perfil vazio para o usuário
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email,
              name: data.user.email?.split('@')[0] || 'Novo Usuário',
              level: 1,
              experience: 0,
              currency: 100,
              has_completed_onboarding: false
            }
          ]);

        if (profileError) {
          throw profileError;
        }
        
        // Indicar que o usuário precisa completar o onboarding
        return { error: null, needsOnboarding: true };
      }

      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Iniciando registro para:', email);
      
      // Registrar o usuário com Supabase
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: username
          },
          emailRedirectTo: window.location.origin + '/onboarding'
        }
      });
      
      console.log('Resposta do signUp:', { data, error });
      
      if (error) {
        console.error('Erro no registro:', error);
        throw error;
      }

      // Se o registro for bem-sucedido, crie um perfil para o usuário
      if (data.user) {
        console.log('Usuário criado, ID:', data.user.id);
        console.log('Criando perfil de usuário...');
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id,
              email: data.user.email,
              name: username || data.user.email?.split('@')[0] || 'Novo Usuário',
              level: 1,
              experience: 0,
              currency: 100,
              has_completed_onboarding: false
            }
          ]);

        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          throw profileError;
        }
        
        console.log('Perfil criado com sucesso');
        return { error: null, needsOnboarding: true };
      } else {
        console.warn('Usuário não foi criado ou não possui ID');
      }

      console.log('Registro concluído com sucesso');
      return { error: null };
    } catch (error: any) {
      console.error('Erro durante o registro:', error);
      // Converter mensagens de erro para português
      let errorMessage = error.message;
      if (errorMessage.includes('Email already registered')) {
        errorMessage = 'Este email já está registrado.';
      } else if (errorMessage.includes('Password should be')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'Email inválido.';
      }
      
      setError(errorMessage);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await supabase.auth.signOut();
      setProfile(null);
      setTasks([]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();

      if (error) {
        throw error;
      }

      setProfile(data?.[0] || null);
      return { error: null };
    } catch (error: any) {
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => {
    if (!user) return { data: null, error: new Error('Usuário não autenticado') };
    
    setLoading(true);
    try {
      const result = await createUserTask(user.id, taskData);
      
      if (result.error) {
        throw result.error;
      }
      
      if (result.data) {
        // Adicionar a nova tarefa ao estado local
        setTasks(prev => [...prev, result.data as Task]);
      }
      
      return { data: result.data as Task, error: null };
    } catch (error: any) {
      setError(error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        tasks,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        updateProfile,
        register,
        completeTask,
        createTask
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 