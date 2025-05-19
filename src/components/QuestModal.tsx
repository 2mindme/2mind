import React from 'react';
import { QuestType } from '../types/gameTypes';
import { createPortal } from 'react-dom';

interface QuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  quest: QuestType | null;
  onComplete?: (questId: string) => void;
}

const QuestModal: React.FC<QuestModalProps> = ({ isOpen, onClose, quest, onComplete }) => {
  if (!isOpen || !quest) return null;

  // Usar portal para renderizar o modal diretamente no body
  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70" onClick={onClose}></div>
      <div 
        className="bg-card relative rounded-xl shadow-lg border border-gray-800 p-6 w-full max-w-md mx-4 z-[9999] overflow-auto max-h-[90vh]"
        style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="space-y-4">
          {/* Título e descrição da missão */}
          <div className="text-white">
            <p className="text-lg font-medium mb-2">{quest.title}</p>
            <p className="text-gray-400 text-sm">{quest.description}</p>
          </div>

          {/* Recompensas */}
          <div>
            <h3 className="text-gray-400 text-sm mb-2">Recompensas:</h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-yellow-800/50 text-yellow-400 text-xs px-3 py-1.5 rounded-full flex items-center">
                <span className="mr-1">✨</span> {quest.xpReward} XP
              </div>
              <div className="bg-blue-800/50 text-blue-400 text-xs px-3 py-1.5 rounded-full flex items-center">
                <span className="mr-1">💎</span> {quest.currencyReward} Cristais
              </div>
              
              {/* Mapear atributos de recompensa */}
              {quest.attributeRewards && Object.entries(quest.attributeRewards).map(([attr, value]) => {
                let color = '';
                let icon = '';
                
                switch(attr) {
                  case 'focus':
                    color = 'bg-green-800/50 text-green-400';
                    icon = '🎯';
                    break;
                  case 'mood':
                    color = 'bg-rose-800/50 text-rose-400';
                    icon = '😊';
                    break;
                  case 'energy':
                    color = 'bg-orange-800/50 text-orange-400';
                    icon = '⚡';
                    break;
                  case 'vitality':
                    color = 'bg-red-800/50 text-red-400';
                    icon = '❤️';
                    break;
                  default:
                    color = 'bg-purple-800/50 text-purple-400';
                    icon = '✨';
                }
                
                return (
                  <div key={attr} className={`${color} text-xs px-3 py-1.5 rounded-full flex items-center`}>
                    <span className="mr-1">{icon}</span> {attr.charAt(0).toUpperCase() + attr.slice(1)} +{value}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tipo da missão */}
          <div>
            <h3 className="text-gray-400 text-sm mb-1">Tipo:</h3>
            <p className="text-white text-sm">
              {quest.recurring 
                ? `Missão recorrente - ${quest.recurringType === 'daily' ? 'Diária' : 'Semanal'}`
                : 'Missão única - Pode ser completada uma vez'}
            </p>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-between pt-4">
            <button
              onClick={onClose}
              className="bg-gray-700/50 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600/50 transition"
            >
              Cancelar
            </button>
            
            {onComplete && !quest.completed && (
              <button
                onClick={() => onComplete(quest.id)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition"
              >
                Completar Missão
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Usar createPortal para renderizar o modal diretamente no body
  return createPortal(modalContent, document.body);
};

export default QuestModal; 