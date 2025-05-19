import { useState } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

const TaskCard = ({ task, onComplete }: TaskCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getRecurringText = () => {
    if (!task.recurring) return null;
    
    switch (task.recurringType) {
      case 'daily':
        return 'Diária';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      default:
        return 'Recorrente';
    }
  };
  
  const getStatBoosts = () => {
    return Object.entries(task.statBoosts).map(([stat, value]) => (
      <span key={stat} className="badge-success">
        {stat} +{value}
      </span>
    ));
  };
  
  return (
    <motion.div 
      className={`bg-glass-gradient backdrop-blur-sm rounded-2xl shadow-card border ${
        task.completed ? 'border-card-light/20' : 'border-white/10'
      } p-5`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="pt-1">
          <button 
            onClick={() => !task.completed && onComplete(task.id)}
            className={`w-6 h-6 rounded-md flex items-center justify-center ${
              task.completed 
                ? 'bg-primary-gradient' 
                : 'border border-white/20 hover:border-primary-400'
            }`}
            disabled={task.completed}
          >
            {task.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className={`font-semibold ${task.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1">
              <span className="badge bg-primary-light/40 text-primary-400 font-medium">+{task.xpReward} XP</span>
            </div>
          </div>
          
          <p className={`text-sm mt-2 ${task.completed ? 'text-gray-500' : 'text-gray-300'}`}>
            {task.description}
          </p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {getStatBoosts()}
            
            {task.recurring && (
              <span className="badge-info">
                {getRecurringText()}
              </span>
            )}
            
            {task.dueDate && (
              <span className="badge-warning">
                Prazo: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isHovered && !task.completed && (
        <motion.div 
          className="mt-4 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={() => onComplete(task.id)}
            className="btn-primary"
          >
            Completar Tarefa
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard; 