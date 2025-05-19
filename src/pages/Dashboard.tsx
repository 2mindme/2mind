import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import StatusEffect from '../components/StatusEffect';
import CreateTaskForm from '../components/CreateTaskForm';
import { Task, User } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;
  const typedUser = user as User;
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const handleCompleteTask = (taskId: string) => {
    // Aqui seria implementada a lógica para completar tarefas
    // e atualizar o usuário com a API
    console.log('Completar tarefa:', taskId);
  };
  
  const handleCreateTask = (taskData: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => {
    // Aqui seria implementada a lógica para criar tarefas
    // e atualizar o usuário com a API
    console.log('Nova tarefa:', taskData);
    setShowCreateForm(false);
  };
  
  const activeTasks = typedUser.tasks.filter((task: Task) => !task.completed);
  const completedTasks = typedUser.tasks.filter((task: Task) => task.completed);
  
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section */}
        <div className="mb-8">
          <motion.div 
            className="bg-glass-gradient rounded-2xl shadow-card border border-card-light/20 p-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo ao seu Dashboard</h1>
                <p className="text-gray-300">Continue sua evolução pessoal e melhore suas habilidades</p>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="flex items-center mb-2">
                  <span className="text-white font-semibold mr-3">Nível {typedUser.level}</span>
                  <span className="badge bg-primary-light/40 text-primary-400 font-medium">
                    {typedUser.currentXP}/{typedUser.xpToNextLevel} XP
                  </span>
                </div>
                <div className="w-full md:w-64 h-3 bg-background-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${(typedUser.currentXP / typedUser.xpToNextLevel) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          <StatCard name="Força" value={typedUser.stats.strength} icon="💪" color="primary" />
          <StatCard name="Intelecto" value={typedUser.stats.intellect} icon="🧠" color="info" />
          <StatCard name="Disciplina" value={typedUser.stats.discipline} icon="⏰" color="warning" />
          <StatCard name="Criatividade" value={typedUser.stats.creativity} icon="🎨" color="secondary" />
          <StatCard name="Resiliência" value={typedUser.stats.resilience} icon="🛡️" color="success" />
        </div>
        
        {/* Status Effects Section */}
        {(typedUser.buffs.length > 0 || typedUser.debuffs.length > 0) && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-white">Status Ativos</h2>
              <span className="badge bg-card-light text-white">
                {typedUser.buffs.length + typedUser.debuffs.length} Status
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {typedUser.buffs.map((buff) => (
                <StatusEffect key={buff.id} effect={buff} type="buff" />
              ))}
              {typedUser.debuffs.map((debuff) => (
                <StatusEffect key={debuff.id} effect={debuff} type="debuff" />
              ))}
            </div>
          </div>
        )}
        
        {/* Tasks Section */}
        <div className="mb-8">
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
                activeTasks.map((task: Task) => (
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
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-white">Tarefas Concluídas</h2>
              <span className="badge bg-success-light text-success">
                {completedTasks.length} Concluídas
              </span>
            </div>
            <div className="space-y-5">
              {completedTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard; 