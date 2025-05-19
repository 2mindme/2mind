import React, { useState, useEffect } from 'react';
import HexagonChart from '../components/HexagonChart';
import { UserData } from '../types/gameTypes';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getUserAttributes } from '../lib/supabase';
import TaskCard from '../components/TaskCard';
import CreateTaskForm from '../components/CreateTaskForm';
import { Task } from '../types';

const DashboardPage: React.FC = () => {
  const { user, profile, tasks, completeTask, createTask } = useAuth();
  const [userData, setUserData] = useState<Partial<UserData>>({
    attributes: {
      vitality: 50,
      energy: 60,
      focus: 40,
      mood: 55
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchAttributes = async () => {
      if (user?.id) {
        try {
          const { data, error } = await getUserAttributes(user.id);
          if (data && !error) {
            setUserData(prev => ({
              ...prev,
              id: user.id,
              name: profile?.name || user.email?.split('@')[0] || 'Caçador Solo',
              level: profile?.level || 1,
              experience: profile?.experience || 0,
              attributes: {
                vitality: data.vitality || 50,
                energy: data.energy || 60,
                focus: data.focus || 40,
                mood: data.mood || 55
              },
              currency: profile?.currency || 100,
            }));
          }
        } catch (error) {
          console.error("Erro ao carregar atributos:", error);
        }
      }
      setLoading(false);
    };

    fetchAttributes();
  }, [user, profile]);
  
  // Dimensões de desenvolvimento pessoal para o gráfico hexagonal
  const developmentDimensions = [
    { name: 'Físico', value: 65, color: '#0D47A1' },
    { name: 'Mental', value: 45, color: '#1976D2' },
    { name: 'Intelectual', value: 70, color: '#2196F3' },
    { name: 'Emocional', value: 50, color: '#42A5F5' },
    { name: 'Social', value: 80, color: '#64B5F6' },
    { name: 'Financeiro', value: 35, color: '#90CAF9' }
  ];

  // Dados para as estatísticas recentes
  const recentActivities = [
    { date: 'Hoje, 10:30', activity: 'Completou treino de pernas', points: 25, type: 'physical' },
    { date: 'Ontem, 16:45', activity: 'Meditou por 20 minutos', points: 15, type: 'mental' },
    { date: 'Ontem, 14:30', activity: 'Completou leitura diária', points: 20, type: 'intellectual' },
    { date: 'Há 2 dias', activity: 'Prática de gratidão', points: 10, type: 'emotional' },
    { date: 'Há 3 dias', activity: 'Networking com 3 pessoas', points: 30, type: 'social' }
  ];

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId);
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => {
    try {
      const { data, error } = await createTask(taskData);
      
      if (error) {
        console.error('Erro ao criar tarefa:', error);
        // Aqui você poderia mostrar uma mensagem de erro na interface
        return;
      }
      
      if (data) {
        console.log('Tarefa criada com sucesso:', data);
        // Esconder o formulário após a criação bem-sucedida
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  // Filtrar as tarefas ativas e concluídas
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Boas-vindas com progresso */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-300">Bem-vindo de volta, {userData.name}</h2>
            <p className="text-sm text-gray-400 mt-1">Continue sua jornada de evolução pessoal</p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-sm text-gray-400 mr-2">Progresso semanal:</span>
            <div className="w-32 h-2 bg-gray-800 rounded-full">
              <div className="h-2 bg-info/80 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <span className="text-sm text-info ml-2">75%</span>
          </div>
        </div>
      </div>

      {/* Seção de indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Status Mental</h3>
          <p className="text-2xl font-bold text-white">Equilibrado</p>
          <div className="flex items-center text-info text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>Melhorando</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Produtividade</h3>
          <p className="text-2xl font-bold text-white">76%</p>
          <div className="flex items-center text-success text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>+12% esta semana</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Missões Concluídas</h3>
          <p className="text-2xl font-bold text-white">{completedTasks.length}/{tasks.length}</p>
          <div className="flex items-center text-info text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Em andamento</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Pontos Acumulados</h3>
          <p className="text-2xl font-bold text-white">{userData.currency || 0}</p>
          <div className="flex items-center text-success text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <span>+85 neste mês</span>
          </div>
        </div>
      </div>

      {/* Gráfico Hexagonal e Atividades Recentes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Equilíbrio de Desenvolvimento</h2>
          <HexagonChart dimensions={developmentDimensions} size={350} />
          <div className="grid grid-cols-3 gap-4 mt-6">
            {developmentDimensions.map((dim, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: dim.color }}></div>
                <span className="text-sm text-gray-400">{dim.name}: {dim.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">{activity.date}</span>
                  <span className="text-xs font-semibold text-info">+{activity.points} pts</span>
                </div>
                <p className="text-sm text-gray-300">{activity.activity}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full text-center text-sm text-info hover:text-info/80 transition-colors">
            Ver todas as atividades
          </button>
        </div>
      </div>

      {/* Tarefas Section */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-white">Tarefas</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            Nova Tarefa
          </button>
        </div>
        
        {showCreateForm ? (
          <CreateTaskForm
            onCreateTask={handleCreateTask}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="space-y-5">
            {activeTasks.length === 0 ? (
              <div className="bg-glass-gradient backdrop-blur-sm rounded-2xl shadow-card border border-card-light/20 p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-card-light flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sem tarefas pendentes</h3>
                <p className="text-gray-400 max-w-md mx-auto mb-6">
                  Não há tarefas pendentes no momento. Crie uma nova tarefa para começar a melhorar suas habilidades!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  Criar Primeira Tarefa
                </button>
              </div>
            ) : (
              activeTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Completed Tasks Section */}
      {completedTasks.length > 0 && (
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-white">Tarefas Concluídas</h2>
            <span className="badge bg-success-light text-success">
              {completedTasks.length} Concluídas
            </span>
          </div>
          <div className="space-y-5">
            {completedTasks.slice(0, 3).map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={handleCompleteTask}
              />
            ))}
            {completedTasks.length > 3 && (
              <button className="mt-4 w-full text-center text-sm text-info hover:text-info/80 transition-colors">
                Ver todas as {completedTasks.length} tarefas concluídas
              </button>
            )}
          </div>
        </div>
      )}

      {/* Análise de atributos */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Análise de Atributos</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {userData.attributes && (
            <>
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-300">Vitalidade</h3>
              <span className="text-sm text-gray-400">{userData.attributes.vitality}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-success rounded-full" 
                style={{ width: `${userData.attributes.vitality}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Energia física e saúde geral</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-300">Energia</h3>
              <span className="text-sm text-gray-400">{userData.attributes.energy}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-info rounded-full" 
                style={{ width: `${userData.attributes.energy}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Disposição e capacidade de realização</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-300">Foco</h3>
              <span className="text-sm text-gray-400">{userData.attributes.focus}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-warning rounded-full" 
                style={{ width: `${userData.attributes.focus}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Concentração e clareza mental</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium text-gray-300">Humor</h3>
              <span className="text-sm text-gray-400">{userData.attributes.mood}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-info rounded-full" 
                style={{ width: `${userData.attributes.mood}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500">Estabilidade emocional e bem-estar</p>
          </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage; 