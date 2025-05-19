import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '../types/gameTypes';
import NeuroscienceWidget from './NeuroscienceWidget';

interface LeaderboardPanelProps {
  leaderboardData?: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
  currentUserId?: string;
}

const LeaderboardPanel: React.FC<LeaderboardPanelProps> = ({ 
  leaderboardData = {
    daily: [],
    weekly: [],
    monthly: []
  }, 
  currentUserId 
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  
  // Dados de exemplo para o leaderboard como fallback
  const defaultLeaderboardData: {
    [key: string]: LeaderboardEntry[]
  } = {
    daily: [
      { userId: '1', username: 'ProdutividadeMáxima', level: 12, achievements: 28, quests: 47, rank: 'Bronze', avatar: '👨‍💼' },
      { userId: '2', username: 'FocusNinja', level: 10, achievements: 25, quests: 42, rank: 'Bronze', avatar: '🥷' },
      { userId: '3', username: 'MestreDasMetas', level: 9, achievements: 23, quests: 39, rank: 'Bronze', avatar: '👨‍🎓' },
      { userId: '4', username: 'DisciplinaTotal', level: 8, achievements: 19, quests: 33, rank: 'Bronze', avatar: '👨‍🚀' },
      { userId: '5', username: 'SuperProdutivo', level: 7, achievements: 16, quests: 29, rank: 'Bronze', avatar: '👩‍💻' },
    ],
    weekly: [
      { userId: '6', username: 'HabitosMaster', level: 15, achievements: 42, quests: 87, rank: 'Prata', avatar: '👨‍🔬' },
      { userId: '7', username: 'MenteFocada', level: 14, achievements: 36, quests: 76, rank: 'Bronze', avatar: '🧙‍♂️' },
      { userId: '1', username: 'ProdutividadeMáxima', level: 12, achievements: 28, quests: 67, rank: 'Bronze', avatar: '👨‍💼' },
      { userId: '8', username: 'DopaminaControle', level: 11, achievements: 26, quests: 54, rank: 'Bronze', avatar: '👩‍🎓' },
      { userId: '2', username: 'FocusNinja', level: 10, achievements: 25, quests: 51, rank: 'Bronze', avatar: '🥷' },
    ],
    monthly: [
      { userId: '9', username: 'SuperaçãoConstante', level: 25, achievements: 87, quests: 315, rank: 'Diamante', avatar: '👑' },
      { userId: '10', username: 'NeuroplasticMind', level: 23, achievements: 79, quests: 298, rank: 'Platina', avatar: '🧠' },
      { userId: '6', username: 'HabitosMaster', level: 20, achievements: 68, quests: 264, rank: 'Ouro', avatar: '👨‍🔬' },
      { userId: '11', username: 'MetaCrush', level: 18, achievements: 65, quests: 251, rank: 'Prata', avatar: '💪' },
      { userId: '7', username: 'MenteFocada', level: 17, achievements: 59, quests: 237, rank: 'Bronze', avatar: '🧙‍♂️' },
    ]
  };

  // Cores associadas a cada rank
  const rankColors = {
    'Bronze': 'text-gray-500',
    'Prata': 'text-green-500',
    'Ouro': 'text-blue-500',
    'Platina': 'text-purple-500',
    'Diamante': 'text-red-500'
  } as const;

  // Decidir qual conjunto de dados usar
  const displayData = {
    daily: leaderboardData.daily.length > 0 ? leaderboardData.daily : defaultLeaderboardData.daily,
    weekly: leaderboardData.weekly.length > 0 ? leaderboardData.weekly : defaultLeaderboardData.weekly,
    monthly: leaderboardData.monthly.length > 0 ? leaderboardData.monthly : defaultLeaderboardData.monthly
  };

  // Obter a classificação de acordo com o período selecionado
  const getRankingByTimeframe = () => {
    return displayData[selectedTimeframe] || [];
  };

  // Obter benefícios neurológicos da competição social
  const getNeuroBenefits = () => {
    const benefits = [
      'A competição saudável ativa o sistema dopaminérgico e aumenta a motivação para realizar tarefas.',
      'Comparação social construtiva reforça a identidade associada ao desempenho positivo.',
      'Ver o progresso de outros ativa áreas cerebrais de planejamento e iniciativa no córtex pré-frontal.',
      'Exposição a modelos de alto desempenho ativa neurônios-espelho e facilita aprendizagem comportamental.',
      'Feedback social positivo libera ocitocina e reduz cortisol, diminuindo estresse e aumentando bem-estar.'
    ];
    
    return benefits[Math.floor(Math.random() * benefits.length)];
  };

  return (
    <div>
      {/* Filtros de período */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-3 py-1 rounded-full text-xs ${selectedTimeframe === 'daily' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSelectedTimeframe('daily')}
        >
          Diário
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-xs ${selectedTimeframe === 'weekly' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSelectedTimeframe('weekly')}
        >
          Semanal
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-xs ${selectedTimeframe === 'monthly' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          onClick={() => setSelectedTimeframe('monthly')}
        >
          Mensal
        </button>
      </div>
      
      {/* Lista de classificação */}
      <div className="space-y-2">
        {getRankingByTimeframe().map((entry, index) => (
          <motion.div
            key={entry.userId}
            className={`bg-gray-700 bg-opacity-50 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-700 ${
              entry.userId === currentUserId ? 'border border-purple-500' : ''
            }`}
            whileHover={{ x: 5 }}
            onClick={() => setSelectedUser(entry)}
          >
            <div className="flex items-center">
              <div className="w-6 font-bold text-gray-400">#{index + 1}</div>
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3 text-lg">
                {entry.avatar || '👤'}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {entry.username}
                  {entry.userId === currentUserId && (
                    <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      Você
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-400">Nível {entry.level}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-sm font-bold ${rankColors[entry.rank as keyof typeof rankColors] || 'text-gray-400'}`}>
                Rank {entry.rank}
              </span>
              <span className="text-xs text-gray-400">{entry.quests} tarefas</span>
            </div>
          </motion.div>
        ))}
        
        {getRankingByTimeframe().length === 0 && (
          <div className="bg-gray-700 bg-opacity-30 rounded-lg p-6 text-center">
            <p className="text-gray-400">Nenhum dado de classificação disponível para este período.</p>
          </div>
        )}
      </div>
      
      {/* Dica neurocientífica */}
      <div className="mt-4">
        <NeuroscienceWidget 
          title="Benefício Neurocognitivo" 
          content={getNeuroBenefits()}
        />
      </div>
      
      {/* Modal com detalhes do usuário */}
      {selectedUser && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedUser(null)}
        >
          <motion.div
            className="bg-gray-800 rounded-lg max-w-md w-full p-5 relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mr-4 text-4xl">
                  {selectedUser.avatar || '👤'}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-purple-300">
                    {selectedUser.username}
                    {selectedUser.userId === currentUserId && (
                      <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                        Você
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center">
                    <span className={`font-bold ${rankColors[selectedUser.rank as keyof typeof rankColors] || 'text-gray-400'}`}>Rank {selectedUser.rank}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-gray-400">Nível {selectedUser.level}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-400">Quests</p>
                <p className="text-xl font-bold text-yellow-400">{selectedUser.quests}</p>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-400">Conquistas</p>
                <p className="text-xl font-bold text-green-400">{selectedUser.achievements}</p>
              </div>
            </div>
            
            {/* Estatísticas de desempenho simuladas */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-300 mb-2">Estatísticas de Desempenho</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Consistência</span>
                    <span>{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500" 
                      style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Foco</span>
                    <span>{Math.floor(Math.random() * 20) + 80}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500" 
                      style={{ width: `${Math.floor(Math.random() * 20) + 80}%` }} 
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Produtividade</span>
                    <span>{Math.floor(Math.random() * 25) + 75}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500" 
                      style={{ width: `${Math.floor(Math.random() * 25) + 75}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Conquistas recentes simuladas */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-2">Conquistas Recentes</h4>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => {
                  const achievements = [
                    { name: 'Maratona de Foco', description: 'Completou 5 horas de foco profundo', icon: '🎯' },
                    { name: 'Mestre da Produtividade', description: 'Completou 50 tarefas em uma semana', icon: '⚡' },
                    { name: 'Imparável', description: '7 dias consecutivos de rotina completa', icon: '🔥' },
                    { name: 'Mente Zen', description: '10 sessões de meditação completas', icon: '🧘' },
                    { name: 'Superação Pessoal', description: 'Quebrou seu próprio recorde de produtividade', icon: '🏆' }
                  ];
                  
                  const achievement = achievements[Math.floor(Math.random() * achievements.length)];
                  
                  return (
                    <div key={i} className="bg-gray-700 bg-opacity-50 p-2 rounded-lg flex items-center">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{achievement.name}</p>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <motion.div 
              className="mt-6 p-3 bg-purple-900 bg-opacity-20 rounded-lg border border-purple-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-xs text-center text-purple-300">
                Colaboração e competição saudável aumentam até 42% a produção de dopamina no sistema de recompensa cerebral.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default LeaderboardPanel; 