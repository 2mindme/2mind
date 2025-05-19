import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quest, QuestDifficulty, QuestType, QuestCategory } from '../types/gameTypes';
import NeuroscienceWidget from './NeuroscienceWidget';
import QuestModal from './QuestModal';
import { createPortal } from 'react-dom';

interface QuestPanelProps {
  quests: QuestType[];
  onCompleteQuest: (questId: string) => void;
}

// Componente de recompensa separado usando portal
const RewardModal: React.FC<{ quest: QuestType, onAnimationComplete: () => void, hasExtraReward: boolean }> = ({ 
  quest, 
  onAnimationComplete,
  hasExtraReward
}) => {
  const modalContent = (
    <>
      {/* Overlay para escurecer o fundo */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998
        }}
      />
      
      {/* Modal centralizado */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          backgroundColor: '#1e293b', // cor do bg-card
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid #374151', // cor do border-gray-800
          padding: '1.5rem',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#c4b5fd', // cor do text-purple-300
            marginBottom: '2rem'
          }}>
            Quest Completada!
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>✨</span>
              <span style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#fbbf24' // cor do text-yellow-400
              }}>
                {quest.xpReward} XP
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.25rem' }}>💎</span>
              <span style={{ 
                fontSize: '1.125rem', 
                fontWeight: 'bold', 
                color: '#60a5fa' // cor do text-blue-400
              }}>
                {quest.currencyReward} Cristais
              </span>
            </div>
            
            {/* Recompensa extra (reforço variável intermitente) */}
            {hasExtraReward && (
              <div style={{
                marginTop: '1.5rem',
                backgroundColor: 'rgba(126, 34, 206, 0.5)', // bg-purple-900/50
                borderRadius: '0.5rem',
                padding: '0.75rem',
                border: '1px solid #a855f7' // border-purple-500
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 'bold', 
                  color: '#c4b5fd', // texto roxo claro
                  marginBottom: '0.25rem'
                }}>
                  Recompensa Surpresa!
                </h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Você ganhou um bônus inesperado!</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>🎁</span>
                  <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 'bold', 
                    color: '#4ade80' // cor do text-green-400
                  }}>
                    +{Math.floor(Math.random() * 20) + 5} Cristais
                  </span>
                </div>
                
                <div style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '0.75rem', 
                  color: '#e9d5ff', // cor do text-purple-200
                  borderTop: '1px solid #7e22ce', // border-purple-700
                  paddingTop: '0.5rem'
                }}>
                  <p>Gatilho Dopaminérgico: Recompensas variáveis e imprevisíveis produzem maior resposta dopaminérgica no nucleus accumbens que recompensas previsíveis.</p>
                </div>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <NeuroscienceWidget 
              title="Ciência da Recompensa" 
              content="Cada tarefa completa reforça circuitos neurais através de condicionamento operante, fortalecendo comportamentos produtivos via liberação de dopamina no sistema de recompensa."
            />
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

const QuestPanel: React.FC<QuestPanelProps> = ({ quests, onCompleteQuest }) => {
  const [selectedQuest, setSelectedQuest] = useState<QuestType | null>(null);
  const [showingReward, setShowingReward] = useState(false);

  // Cores associadas à dificuldade
  const difficultyColors = {
    [QuestDifficulty.Easy]: 'bg-green-500',
    [QuestDifficulty.Medium]: 'bg-yellow-500',
    [QuestDifficulty.Hard]: 'bg-red-500',
    [QuestDifficulty.Boss]: 'bg-purple-500',
    'easy': 'bg-green-500',
    'medium': 'bg-yellow-500',
    'hard': 'bg-red-500',
    'boss': 'bg-purple-500'
  };

  // Ícones associados à categoria
  const categoryIcons: Record<string, string> = {
    [QuestCategory.Physical]: '💪',
    [QuestCategory.Mental]: '🧠',
    [QuestCategory.Social]: '👥',
    [QuestCategory.Personal]: '🧘',
    [QuestCategory.Professional]: '💼',
    'physical': '💪',
    'mental': '🧠',
    'social': '👥', 
    'personal': '🧘',
    'professional': '💼',
    'default': '📋'
  };

  // Animação para completar quest
  const completeQuestWithAnimation = (quest: QuestType) => {
    // Primeiro mostra animação de recompensa
    setShowingReward(true);
    
    // Após animação, completa a quest
    setTimeout(() => {
      setShowingReward(false);
      onCompleteQuest(quest.id);
      setSelectedQuest(null);
    }, 2500);
  };

  // Probabilidade de recompensa extra (reforço variável)
  const hasExtraReward = Math.random() < 0.3; // 30% de chance

  if (quests.length === 0) {
    return <p className="text-gray-400 text-sm">Nenhuma missão disponível no momento.</p>;
  }

  // Determinar a categoria com base na descrição
  const getCategoryFromQuest = (quest: QuestType): string => {
    const title = quest.title.toLowerCase();
    const description = quest.description.toLowerCase();
    
    if (title.includes('exercíc') || title.includes('atividade física') || 
        description.includes('exercíc') || description.includes('atividade física') ||
        title.includes('treino') || description.includes('treino') ||
        title.includes('caminh') || description.includes('caminh')) {
      return 'physical';
    } else if (title.includes('medit') || description.includes('medit') ||
              title.includes('focus') || description.includes('focus') ||
              title.includes('atenção') || description.includes('atenção')) {
      return 'mental';
    } else if (title.includes('projet') || description.includes('projet') ||
              title.includes('trabalho') || description.includes('trabalho') ||
              title.includes('relatório') || description.includes('relatório')) {
      return 'professional';
    } else if (title.includes('dorm') || description.includes('dorm') ||
              title.includes('sono') || description.includes('sono') ||
              title.includes('rotina') || description.includes('rotina')) {
      return 'personal';
    } else if (title.includes('social') || description.includes('social') ||
              title.includes('amigo') || description.includes('amigo') ||
              title.includes('família') || description.includes('família')) {
      return 'social';
    }
    
    return 'default';
  };

  // Determinar a dificuldade com base na recompensa
  const getDifficultyFromQuest = (quest: QuestType): string => {
    const xpReward = quest.xpReward || 0;
    
    if (xpReward <= 20) return 'easy';
    if (xpReward <= 50) return 'medium';
    if (xpReward <= 100) return 'hard';
    return 'boss';
  };

  // Função para completar a missão
  const handleCompleteQuest = (questId: string) => {
    if (selectedQuest && selectedQuest.id === questId) {
      completeQuestWithAnimation(selectedQuest);
    }
  };

  return (
    <div className="space-y-4">
      {/* Lista de quests disponíveis */}
      <div className="grid gap-3 md:grid-cols-2">
        {quests.map(quest => {
          const category = getCategoryFromQuest(quest);
          const difficulty = getDifficultyFromQuest(quest);
          
          return (
            <motion.div
              key={quest.id}
              className="bg-gray-700 rounded-lg p-3 cursor-pointer relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedQuest(quest)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="text-xl mr-2">{categoryIcons[category]}</span>
                  <h3 className="font-medium text-sm">{quest.title}</h3>
                </div>
                <div className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[difficulty]} text-white`}>
                  {difficulty === 'easy' ? 'Fácil' : 
                   difficulty === 'medium' ? 'Médio' : 
                   difficulty === 'hard' ? 'Difícil' : 'Chefe'}
                </div>
              </div>
              
              <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                <span>{quest.recurring ? (quest.recurringType === 'daily' ? 'Diária' : 'Semanal') : 'Única'}</span>
                <div className="flex items-center">
                  <span className="mr-2">{quest.xpReward} XP</span>
                  <span>{quest.currencyReward} 💎</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Modal de detalhes da quest */}
      <QuestModal 
        isOpen={!!selectedQuest && !showingReward}
        onClose={() => setSelectedQuest(null)}
        quest={selectedQuest}
        onComplete={handleCompleteQuest}
      />
      
      {/* Painel de recompensa - mostrado após completar */}
      {selectedQuest && showingReward && (
        <RewardModal 
          quest={selectedQuest} 
          onAnimationComplete={() => {}} 
          hasExtraReward={hasExtraReward} 
        />
      )}
    </div>
  );
};

export default QuestPanel; 