import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import AchievementCard from '../components/AchievementCard';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements'>('stats');
  
  if (!user) return null;
  
  const calculateTotalStats = () => {
    const baseStats = { ...user.stats };
    
    // Adicionar bônus de buffs
    user.buffs.forEach(buff => {
      Object.entries(buff.statBoosts).forEach(([stat, value]) => {
        baseStats[stat as keyof typeof baseStats] += value;
      });
    });
    
    // Subtrair penalidades de debuffs
    user.debuffs.forEach(debuff => {
      Object.entries(debuff.statPenalties).forEach(([stat, value]) => {
        baseStats[stat as keyof typeof baseStats] += value; // value já é negativo
      });
    });
    
    return baseStats;
  };
  
  const totalStats = calculateTotalStats();
  const unlockedAchievements = user.achievements.filter(a => a.unlockedAt);
  const lockedAchievements = user.achievements.filter(a => !a.unlockedAt);
  
  const daysSinceJoined = () => {
    const joined = new Date(user.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joined.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  return (
    <div className="container mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary-100">
              <img 
                src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.username}</h1>
              <p className="text-gray-500 mb-4">{user.email}</p>
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                    Nível {user.level}
                  </span>
                  <span className="text-sm text-gray-500">
                    {user.currentXP}/{user.xpToNextLevel} XP
                  </span>
                </div>
                
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{ width: `${(user.currentXP / user.xpToNextLevel) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <div className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  Aventurando há {daysSinceJoined()} dias
                </div>
                <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {unlockedAchievements.length} conquistas
                </div>
                <div className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {user.tasks.filter(t => t.completed).length} tarefas concluídas
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Atributos
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'achievements'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Conquistas
              </button>
            </nav>
          </div>
          
          {activeTab === 'stats' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard name="Força" value={totalStats.strength} icon="💪" color="primary" />
                <StatCard name="Intelecto" value={totalStats.intellect} icon="🧠" color="blue" />
                <StatCard name="Disciplina" value={totalStats.discipline} icon="⏰" color="yellow" />
                <StatCard name="Criatividade" value={totalStats.creativity} icon="🎨" color="purple" />
                <StatCard name="Resiliência" value={totalStats.resilience} icon="🛡️" color="green" />
              </div>
              
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sobre os Atributos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">💪</span>
                      <h3 className="font-medium text-gray-700">Força</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Representa sua força mental e física. Aumenta a capacidade de superar desafios difíceis e a persistência em tarefas árduas.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">🧠</span>
                      <h3 className="font-medium text-gray-700">Intelecto</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Representa sua capacidade de aprendizado e raciocínio. Melhora a absorção de conhecimentos e a resolução de problemas complexos.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">⏰</span>
                      <h3 className="font-medium text-gray-700">Disciplina</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Representa sua consistência e regularidade. Aumenta a capacidade de manter rotinas e hábitos positivos ao longo do tempo.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">🎨</span>
                      <h3 className="font-medium text-gray-700">Criatividade</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Representa sua capacidade de inovar e pensar diferente. Melhora a resolução criativa de problemas e a expressão artística.
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-2">🛡️</span>
                      <h3 className="font-medium text-gray-700">Resiliência</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Representa sua capacidade de lidar com adversidades. Aumenta a recuperação após falhas e a adaptação a mudanças inesperadas.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Conquistas Desbloqueadas</h2>
              {unlockedAchievements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Você ainda não desbloqueou nenhuma conquista. Complete tarefas para obter conquistas!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {unlockedAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} isUnlocked={true} />
                  ))}
                </div>
              )}
              
              {lockedAchievements.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Conquistas Pendentes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lockedAchievements.map(achievement => (
                      <AchievementCard key={achievement.id} achievement={achievement} isUnlocked={false} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 