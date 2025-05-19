import { motion } from 'framer-motion';
import { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked?: boolean;
}

const AchievementCard = ({ achievement, isUnlocked = false }: AchievementCardProps) => {
  return (
    <motion.div 
      className={`relative bg-glass-gradient backdrop-blur-sm rounded-2xl shadow-card border ${
        isUnlocked 
          ? 'border-warning/30' 
          : 'border-card-light/20 opacity-70'
      } p-5`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isUnlocked && (
        <div className="absolute -top-2 -right-2 bg-warning-gradient text-white text-xs font-bold px-3 py-1 rounded-full shadow-button">
          Conquistado!
        </div>
      )}
      
      <div className="flex items-center mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isUnlocked ? 'bg-warning-gradient' : 'bg-card-light'
        } mr-4`}>
          <span className="text-2xl">{achievement.icon}</span>
        </div>
        <h3 className={`font-semibold ${isUnlocked ? 'text-warning' : 'text-gray-400'}`}>
          {achievement.name}
        </h3>
      </div>
      
      <p className={`text-sm mb-4 ${isUnlocked ? 'text-gray-200' : 'text-gray-400'}`}>
        {achievement.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="badge bg-primary-light/40 text-primary-400 font-medium">
          +{achievement.xpReward} XP
        </div>
        
        {isUnlocked && achievement.unlockedAt && (
          <div className="text-xs text-gray-400">
            Conquistado em {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
      
      {!isUnlocked && (
        <div className="mt-4 border-t border-white/5 pt-3">
          <h4 className="text-xs font-medium text-gray-300 mb-2">Requisitos:</h4>
          <ul className="text-xs text-gray-400 space-y-2">
            {achievement.requirements.map((req, index) => (
              <li key={index} className="flex items-center">
                <span className="w-5 h-5 rounded-md border border-white/20 flex items-center justify-center mr-2"></span> 
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default AchievementCard; 