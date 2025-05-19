import { motion } from 'framer-motion';

interface StatCardProps {
  name: string;
  value: number;
  icon: string;
  maxValue?: number;
  color?: string;
}

const StatCard = ({ name, value, icon, maxValue = 10, color = 'primary' }: StatCardProps) => {
  const percentage = (value / maxValue) * 100;
  
  // Mapeia cores do Tailwind para gradientes
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-gradient',
    secondary: 'bg-secondary-gradient',
    success: 'bg-success-gradient',
    info: 'bg-info-gradient',
    warning: 'bg-warning-gradient',
    danger: 'bg-danger-gradient',
    green: 'bg-success-gradient',
    blue: 'bg-info-gradient',
    yellow: 'bg-warning-gradient',
    purple: 'bg-secondary-gradient',
    red: 'bg-danger-gradient',
  };
  
  const bgGradient = colorMap[color] || colorMap.primary;
  
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgGradient} mr-3`}>
            <span className="text-xl">{icon}</span>
          </div>
          <h3 className="font-medium text-white">{name}</h3>
        </div>
        <span className="text-lg font-semibold text-white">{value}/{maxValue}</span>
      </div>
      
      <div className="progress-bar">
        <motion.div 
          className={`h-full ${bgGradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default StatCard; 