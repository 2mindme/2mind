import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserData, SkillNode } from '../types/gameTypes';
import NeuroscienceWidget from './NeuroscienceWidget';
import { createPortal } from 'react-dom';

interface SkillTreeProps {
  userData: UserData;
}

// Componente de modal para habilidades
const SkillModal: React.FC<{ 
  skill: SkillNode | null, 
  onClose: () => void, 
  onUnlock: (skill: SkillNode) => void,
  userData: UserData,
  isSkillAvailable: (skill: SkillNode) => boolean,
  exampleSkills: SkillNode[] 
}> = ({ skill, onClose, onUnlock, userData, isSkillAvailable, exampleSkills }) => {
  if (!skill) return null;
  
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
        onClick={onClose}
      />
      
      {/* Modal centralizado */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          backgroundColor: '#1f2937', // cor do bg-gray-800
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid #374151', // cor do border-gray-700
          padding: '1.25rem',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <span className="text-3xl mr-3">{skill.icon}</span>
            <div>
              <h3 className="font-bold text-lg text-purple-300">{skill.name}</h3>
              <p className="text-sm text-gray-400">Nível {skill.level}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-300 mb-3">{skill.description}</p>
          
          <div className="bg-gray-700 rounded-lg p-3 mb-3">
            <h4 className="text-sm font-bold text-purple-300 mb-2">Bônus</h4>
            <div className="grid grid-cols-2 gap-2">
              {skill.provides.attributeBonus && Object.entries(skill.provides.attributeBonus).map(([attr, bonus]) => (
                <div key={attr} className="flex items-center">
                  <span className="text-green-400 mr-1">+{bonus}</span>
                  <span className="text-gray-300 capitalize">{attr}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Custo e pré-requisitos */}
          <div className="flex justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-400">Custo</h4>
              <div className="flex items-center">
                <span className="text-yellow-400 font-bold mr-1">{skill.cost}</span>
                <span className="text-yellow-400">Cristais</span>
              </div>
            </div>
            
            {skill.requires.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-400">Pré-requisitos</h4>
                <ul className="text-sm">
                  {skill.requires.map(reqId => {
                    const req = exampleSkills.find(s => s.id === reqId);
                    return (
                      <li key={reqId} className={req?.unlocked ? 'text-green-400' : 'text-red-400'}>
                        {req?.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <NeuroscienceWidget 
              title="Base Neurocientífica" 
              content={skill.neuroscience}
              showInitially={true}
            />
          </div>
          
          <div className="flex justify-end">
            {!skill.unlocked && isSkillAvailable(skill) && userData.currency >= skill.cost && (
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium"
                onClick={() => onUnlock(skill)}
              >
                Desbloquear
              </button>
            )}
            
            {!skill.unlocked && userData.currency < skill.cost && (
              <span className="text-red-400 text-sm">Cristais insuficientes</span>
            )}
            
            {skill.unlocked && (
              <span className="text-green-400 text-sm">Habilidade Desbloqueada</span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

const SkillTree: React.FC<SkillTreeProps> = ({ userData }) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  
  // Habilidades de exemplo (em produção, seriam passadas via props)
  const exampleSkills: SkillNode[] = [
    {
      id: 'skill1',
      name: 'Foco Sustentado',
      description: 'Aumenta a capacidade de manter foco em uma tarefa por períodos prolongados',
      icon: '🧠',
      level: 1,
      unlocked: true,
      cost: 50,
      requires: [],
      provides: {
        attributeBonus: {
          focus: 5
        }
      },
      neuroscience: 'Fortalece vias de controle inibitório no córtex pré-frontal dorsolateral, aumentando resistência à distração através da modulação de receptores dopaminérgicos D1.'
    },
    {
      id: 'skill2',
      name: 'Resistência Mental',
      description: 'Reduz o impacto de tarefas mentalmente exaustivas',
      icon: '🛡️',
      level: 2,
      unlocked: false,
      cost: 100,
      requires: ['skill1'],
      provides: {
        attributeBonus: {
          focus: 3,
          energy: 3
        }
      },
      neuroscience: 'Otimiza o consumo energético cerebral através da regulação eficiente do metabolismo da glicose e melhora a sincronização entre redes neurais de atenção.'
    },
    {
      id: 'skill3',
      name: 'Recuperação Acelerada',
      description: 'Reduz o tempo necessário para recuperar energia após atividades intensas',
      icon: '⚡',
      level: 1,
      unlocked: true,
      cost: 75,
      requires: [],
      provides: {
        attributeBonus: {
          energy: 7
        }
      },
      neuroscience: 'Aumenta a eficiência da função mitocondrial em neurônios do hipotálamo e tronco cerebral, acelerando a produção de ATP e normalizando o eixo HPA após estresse.'
    },
    {
      id: 'skill4',
      name: 'Disciplina Emocional',
      description: 'Melhora a capacidade de manter equilíbrio emocional em situações estressantes',
      icon: '😌',
      level: 1,
      unlocked: false,
      cost: 100,
      requires: [],
      provides: {
        attributeBonus: {
          mood: 8
        }
      },
      neuroscience: 'Fortalece conexões entre córtex pré-frontal e amígdala, permitindo melhor regulação de respostas emocionais através de controle top-down e modulação serotoninérgica.'
    },
    {
      id: 'skill5',
      name: 'Hiperfoco',
      description: 'Desbloqueia a capacidade de entrar em estado de flow de forma controlada',
      icon: '⚡🧠',
      level: 3,
      unlocked: false,
      cost: 250,
      requires: ['skill1', 'skill2'],
      provides: {
        attributeBonus: {
          focus: 15
        }
      },
      neuroscience: 'Induz estado de sincronização entre ondas alfa e teta no córtex, aumentando eficiência cognitiva e criando condições neurológicas para estado de flow, com redução de atividade no córtex pré-frontal medial e aumento de atividade em circuitos de recompensa.'
    }
  ];

  // Verifica se uma habilidade está disponível para ser desbloqueada
  const isSkillAvailable = (skill: SkillNode): boolean => {
    if (skill.unlocked) return false;
    
    // Verifica se todos os pré-requisitos estão desbloqueados
    return skill.requires.every(requiredId => {
      const requiredSkill = exampleSkills.find(s => s.id === requiredId);
      return requiredSkill?.unlocked;
    });
  };

  // Calcula a cor da habilidade com base no estado
  const getSkillColor = (skill: SkillNode): string => {
    if (skill.unlocked) {
      return 'bg-purple-600 border-purple-400';
    } else if (isSkillAvailable(skill)) {
      return 'bg-blue-600 border-blue-400';
    } else {
      return 'bg-gray-700 border-gray-600';
    }
  };

  // Função para desbloquear uma habilidade
  const unlockSkill = (skill: SkillNode) => {
    // Em uma implementação real, isso atualizaria o estado global
    // com a habilidade desbloqueada e aplicaria os buffs correspondentes
    setSelectedSkill(null);
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-bold text-purple-300">Árvore de Habilidades</h3>
        <div className="text-sm text-gray-400">
          <span className="text-yellow-400 font-bold mr-1">{userData.currency}</span>
          <span>Cristais disponíveis</span>
        </div>
      </div>
      
      {/* Visualização da árvore de habilidades */}
      <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 relative">
        {/* Em uma implementação real, usaria uma biblioteca como react-flow para conexões visuais */}
        <div className="grid grid-cols-3 gap-4">
          {exampleSkills.map((skill) => (
            <motion.div
              key={skill.id}
              className={`p-3 rounded-lg border-2 ${getSkillColor(skill)} cursor-pointer relative`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedSkill(skill)}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl mb-1">{skill.icon}</span>
                <h4 className="text-sm font-bold mb-1">{skill.name}</h4>
                <div className="text-xs text-gray-400">Nível {skill.level}</div>
                
                {/* Indicador de custo */}
                <div className="absolute top-1 right-1 text-xs flex items-center">
                  <span className="text-yellow-400 mr-1">{skill.cost}</span>
                  <span className="text-yellow-400 text-xs">💎</span>
                </div>
                
                {/* Indicador de status */}
                <div className="absolute bottom-1 right-1">
                  {skill.unlocked ? (
                    <span className="text-xs text-green-400">Desbloqueado</span>
                  ) : isSkillAvailable(skill) ? (
                    <span className="text-xs text-blue-400">Disponível</span>
                  ) : (
                    <span className="text-xs text-gray-500">Bloqueado</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Linhas de conexão (simplificadas) */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Exemplo de conexão Skill1 -> Skill2 */}
            <line x1="25%" y1="25%" x2="50%" y2="25%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            
            {/* Exemplo de conexão Skill1 -> Skill5 */}
            <line x1="25%" y1="25%" x2="25%" y2="75%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            <line x1="25%" y1="75%" x2="75%" y2="75%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            
            {/* Exemplo de conexão Skill2 -> Skill5 */}
            <line x1="50%" y1="25%" x2="50%" y2="75%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
            <line x1="50%" y1="75%" x2="75%" y2="75%" stroke="#6366f1" strokeWidth="2" strokeDasharray="4" />
          </svg>
        </div>
      </div>
      
      {/* Substituir o modal existente pelo novo SkillModal */}
      {selectedSkill && (
        <SkillModal 
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onUnlock={unlockSkill}
          userData={userData}
          isSkillAvailable={isSkillAvailable}
          exampleSkills={exampleSkills}
        />
      )}
    </div>
  );
};

export default SkillTree; 