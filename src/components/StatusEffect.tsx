import { motion } from 'framer-motion';
import { Buff, Debuff } from '../types';

interface StatusEffectProps {
  effect: Buff | Debuff;
  type: 'buff' | 'debuff';
}

const StatusEffect = ({ effect, type }: StatusEffectProps) => {
  const isActive = () => {
    const startDate = new Date(effect.startedAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + effect.duration);
    return new Date() <= endDate;
  };

  const getDaysRemaining = () => {
    const startDate = new Date(effect.startedAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + effect.duration);
    
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const getStatusBgAndColor = () => {
    if (type === 'buff') {
      return {
        bg: 'bg-success-light/30',
        border: 'border-success/30',
        gradient: 'bg-success-gradient',
        text: 'text-success'
      };
    } else {
      return {
        bg: 'bg-danger-light/30',
        border: 'border-danger/30',
        gradient: 'bg-danger-gradient',
        text: 'text-danger'
      };
    }
  };

  const getStatEffects = () => {
    if (type === 'buff') {
      const buff = effect as Buff;
      return Object.entries(buff.statBoosts).map(([stat, value]) => (
        <span key={stat} className="badge-success">
          {stat} +{value}
        </span>
      ));
    } else {
      const debuff = effect as Debuff;
      return Object.entries(debuff.statPenalties).map(([stat, value]) => (
        <span key={stat} className="badge-danger">
          {stat} {value}
        </span>
      ));
    }
  };

  const progressPercentage = (getDaysRemaining() / effect.duration) * 100;
  const { bg, border, gradient, text } = getStatusBgAndColor();

  return (
    <motion.div 
      className={`bg-glass-gradient backdrop-blur-sm rounded-2xl shadow-card border ${border} p-5`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient} mr-3`}>
          <span className="text-xl">{effect.icon}</span>
        </div>
        <h3 className="font-medium text-white">{effect.name}</h3>
      </div>
      
      <p className="text-sm text-gray-300 mb-3">{effect.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {getStatEffects()}
      </div>
      
      <div className="mt-3">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-gray-400">Duração</span>
          <span className={text}>{getDaysRemaining()} / {effect.duration} dias restantes</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`h-full ${gradient}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default StatusEffect; 