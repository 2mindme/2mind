import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserAvatar from './UserAvatar';
import AttributeStats from './AttributeStats';
import QuestPanel from './QuestPanel';
import RewardSystem from './RewardSystem';
import SkillTree from './SkillTree';
import NeuroscienceWidget from './NeuroscienceWidget';
import StatusEffects from './StatusEffects';
import LeaderboardPanel from './LeaderboardPanel';
import StorePanel from './StorePanel';
import { UserData, QuestType } from '../types/gameTypes';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';
import StatusEffect from './StatusEffect';

const Dashboard: React.FC = () => {
  const { user, profile, tasks, completeTask } = useAuth();
  const [activeTab, setActiveTab] = useState('quests');
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [userData, setUserData] = useState<UserData>({
    id: '1',
    name: 'Caçador Solo',
    level: 1,
    experience: 0,
    attributes: {
      vitality: 50, // saúde física
      energy: 60,   // sono e alimentação
      focus: 40,    // produtividade
      mood: 55      // estado emocional
    },
    activeBuffs: [],
    activeDebuffs: [],
    activePersona: 'default',
    currency: 100,
    completedQuests: [],
    activeQuests: [],
    inventory: [],
    achievements: []
  });

  useEffect(() => {
    // Simulação de dados de smartwatch/app
    const intervalId = setInterval(() => {
      // Aqui seria a integração com APIs reais de tracking
      const healthData = {
        steps: Math.floor(Math.random() * 1000),
        heartRate: 70 + Math.floor(Math.random() * 20),
        sleepHours: 6 + Math.random() * 2,
        focusMinutes: Math.floor(Math.random() * 120)
      };
      
      // Atualiza atributos com base nos dados coletados
      updateAttributesFromHealthData(healthData);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const updateAttributesFromHealthData = (healthData: any) => {
    // Algoritmo baseado em neurociência para ajustar atributos
    setUserData(prevData => {
      const newVitality = calculateAttribute(
        prevData.attributes.vitality, 
        healthData.steps > 500 ? 2 : -1,
        healthData.heartRate > 80 ? -1 : 1
      );
      
      const newEnergy = calculateAttribute(
        prevData.attributes.energy,
        healthData.sleepHours > 7 ? 3 : -2,
        0
      );
      
      const newFocus = calculateAttribute(
        prevData.attributes.focus,
        healthData.focusMinutes > 60 ? 5 : -1,
        0
      );

      // Algoritmo que relaciona os outros atributos ao humor
      const newMood = calculateAttribute(
        prevData.attributes.mood,
        (newVitality + newEnergy + newFocus) / 3 > prevData.attributes.mood ? 2 : -1,
        0
      );

      return {
        ...prevData,
        attributes: {
          vitality: newVitality,
          energy: newEnergy,
          focus: newFocus,
          mood: newMood
        }
      };
    });
  };

  // Função utilitária para calcular novo valor de atributo
  const calculateAttribute = (current: number, change: number, modifier: number): number => {
    const newValue = current + change + modifier;
    return Math.max(1, Math.min(100, newValue)); // Mantém entre 1-100
  };

  // Simula recompensa inesperada (reforço intermitente variável)
  const triggerRandomReward = () => {
    // Algoritmo que gera recompensas com probabilidade variável
    // baseado em princípios de reforço operante
    if (Math.random() < 0.3) { // 30% de chance
      const rewardAmount = Math.floor(Math.random() * 20) + 5;
      setUserData(prev => ({
        ...prev,
        currency: prev.currency + rewardAmount
      }));
      
      // Aqui seria disparado um feedback sensorial (visual/sonoro)
      // representando a liberação de dopamina controlada
      return rewardAmount;
    }
    return 0;
  };

  const completeQuest = (questId: string) => {
    // Algoritmo de finalização de missão com recompensa variável
    const rewardBase = 10;
    const experienceGain = 20;
    const randomBonus = triggerRandomReward();
    
    setUserData(prev => {
      const updatedQuests = prev.activeQuests.filter(q => q.id !== questId);
      const completed = prev.activeQuests.find(q => q.id === questId);
      
      if (!completed) return prev;
      
      return {
        ...prev,
        experience: prev.experience + experienceGain,
        currency: prev.currency + rewardBase,
        activeQuests: updatedQuests,
        completedQuests: [...prev.completedQuests, completed]
      };
    });
    
    // Verificar evolução de nível baseado em experiência
    checkLevelUp();
  };

  const checkLevelUp = () => {
    setUserData(prev => {
      const experienceToNextLevel = prev.level * 100;
      if (prev.experience >= experienceToNextLevel) {
        // Animação de levelup com estética de Solo Leveling
        return {
          ...prev,
          level: prev.level + 1,
          experience: prev.experience - experienceToNextLevel,
          // Bônus de atributos ao subir de nível
          attributes: {
            vitality: calculateAttribute(prev.attributes.vitality, 5, 0),
            energy: calculateAttribute(prev.attributes.energy, 5, 0),
            focus: calculateAttribute(prev.attributes.focus, 5, 0),
            mood: calculateAttribute(prev.attributes.mood, 5, 0)
          }
        };
      }
      return prev;
    });
  };

  return (
    <motion.div 
      className="bg-gray-900 text-gray-100 min-h-screen p-4 font-['DM_Sans']"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-purple-700 pb-4">
          <div className="flex items-center">
            <UserAvatar userData={userData} />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-purple-400">{userData.name}</h1>
              <p className="text-sm text-gray-400">Nível {userData.level} | {userData.experience} EXP</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-2 font-bold">{userData.currency}</span>
            <span className="text-yellow-400">Cristais</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Atributos</h2>
            <AttributeStats attributes={userData.attributes} />
            <StatusEffects buffs={userData.activeBuffs} debuffs={userData.activeDebuffs} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Missões Ativas</h2>
            <QuestPanel 
              quests={userData.activeQuests} 
              onCompleteQuest={completeQuest} 
            />
            <div className="mt-4">
              <NeuroscienceWidget 
                title="Dica Neurocientífica" 
                content="Completar tarefas ativa seu sistema de recompensa, liberando dopamina de forma saudável e construindo novos circuitos neuronais." 
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Progressão de Habilidades</h2>
            <SkillTree userData={userData} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Loja</h2>
            <StorePanel userData={userData} setUserData={setUserData} />
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-purple-300">Classificação</h2>
            <LeaderboardPanel />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 