import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task, UserStats } from '../types';

interface CreateTaskFormProps {
  onCreateTask: (task: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreateTaskForm = ({ onCreateTask, onCancel }: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(10);
  const [recurring, setRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dueDate, setDueDate] = useState('');
  const [statBoosts, setStatBoosts] = useState<Partial<UserStats>>({
    strength: 0,
    intellect: 0,
    discipline: 0,
    creativity: 0,
    resilience: 0
  });

  const handleStatBoostChange = (stat: keyof UserStats, value: number) => {
    setStatBoosts(prev => ({
      ...prev,
      [stat]: Math.max(0, value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Omit<Task, 'id' | 'completed' | 'completedAt' | 'createdAt'> = {
      title,
      description,
      xpReward,
      statBoosts: Object.fromEntries(
        Object.entries(statBoosts).filter(([_, value]) => value > 0)
      ) as Partial<UserStats>,
      recurring,
      ...(recurring ? { recurringType } : {}),
      ...(dueDate ? { dueDate } : {})
    };
    
    onCreateTask(newTask);
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Nova Tarefa</h2>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-gradient">
          <span className="text-xl">📝</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input h-28 resize-none"
              required
            />
          </div>
          
          <div>
            <label htmlFor="xp" className="block text-sm font-medium text-gray-300 mb-2">
              Recompensa de XP
            </label>
            <input
              type="number"
              id="xp"
              value={xpReward}
              onChange={(e) => setXpReward(Math.max(1, parseInt(e.target.value, 10) || 0))}
              className="input"
              min="1"
              required
            />
          </div>
          
          <div className="flex items-center">
            <div className="bg-card-light/50 rounded-lg p-1">
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="hidden"
              />
              <label htmlFor="recurring" className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all ${recurring ? 'bg-primary-gradient text-white' : 'text-gray-300'}`}>
                <span className="text-sm font-medium">Tarefa recorrente</span>
                <span className="ml-2 text-sm">{recurring ? '✓' : ''}</span>
              </label>
            </div>
          </div>
          
          {recurring && (
            <div>
              <label htmlFor="recurringType" className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de recorrência
              </label>
              <select
                id="recurringType"
                value={recurringType}
                onChange={(e) => setRecurringType(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="input"
                required
              >
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          )}
          
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">
              Data de vencimento (opcional)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Bônus de Atributos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(statBoosts).map(([stat, value]) => (
                <div key={stat} className="bg-card-light/50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor={`stat-${stat}`} className="block text-sm text-white">
                      {stat}
                    </label>
                    <span className="badge-success">{value > 0 ? `+${value}` : value}</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg bg-background-dark text-gray-400 flex items-center justify-center hover:bg-card-dark"
                      onClick={() => handleStatBoostChange(stat as keyof UserStats, (value || 0) - 1)}
                    >
                      -
                    </button>
                    <div className="progress-bar mx-2 flex-1">
                      <div 
                        className="h-full bg-success-gradient"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-lg bg-background-dark text-gray-400 flex items-center justify-center hover:bg-card-dark"
                      onClick={() => handleStatBoostChange(stat as keyof UserStats, (value || 0) + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn-glass"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={!title || !description}
          >
            Criar Tarefa
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateTaskForm; 