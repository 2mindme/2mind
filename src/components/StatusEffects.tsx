import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatusEffect } from '../types/gameTypes';

interface StatusEffectsProps {
  buffs: StatusEffect[];
  debuffs: StatusEffect[];
}

const StatusEffects: React.FC<StatusEffectsProps> = ({ buffs, debuffs }) => {
  const [selectedEffect, setSelectedEffect] = useState<StatusEffect | null>(null);
  
  // Efeitos de exemplo para demonstração (em produção seriam passados via props)
  const exampleBuffs: StatusEffect[] = buffs.length ? buffs : [
    {
      id: 'buff1',
      name: 'Foco Intenso',
      description: 'Aumento na capacidade de concentração e produtividade',
      icon: '🎯',
      duration: 3600, // 1 hora em segundos
      affects: 'focus',
      modifier: 15,
      source: 'Completou 3 tarefas seguidas',
      neuroscience: 'Sequência de tarefas completadas ativa circuitos de inibição pré-frontal, reduzindo distração e aumentando produção de norepinefrina no locus coeruleus.'
    },
    {
      id: 'buff2',
      name: 'Energia Renovada',
      description: 'Aumento nos níveis de energia física e mental',
      icon: '⚡',
      duration: 7200, // 2 horas em segundos
      affects: 'energy',
      modifier: 10,
      source: 'Dormiu 8 horas',
      neuroscience: 'Sono adequado normaliza os níveis de ATP mitocondrial, restabelece reservas de glicogênio cerebral e otimiza a funcionalidade do córtex pré-frontal.'
    }
  ];
  
  const exampleDebuffs: StatusEffect[] = debuffs.length ? debuffs : [
    {
      id: 'debuff1',
      name: 'Distração Digital',
      description: 'Redução na capacidade de concentração devido ao uso excessivo de redes sociais',
      icon: '📱',
      duration: 5400, // 1.5 horas em segundos
      affects: 'focus',
      modifier: -10,
      source: 'Uso de mídias sociais > 2h',
      neuroscience: 'Exposição prolongada a estímulos digitais de recompensa variável desensibiliza receptores D2 no núcleo accumbens e fragmenta circuitos de atenção sustentada.'
    }
  ];

  // Formata tempo restante
  const formatTimeRemaining = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Retorna cor associada ao tipo de efeito
  const getEffectTypeColor = (effect: StatusEffect) => {
    return effect.modifier > 0 ? 'text-green-400' : 'text-red-400';
  };

  // Abre modal com detalhes do efeito
  const openEffectDetails = (effect: StatusEffect) => {
    setSelectedEffect(effect);
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-bold mb-2 text-purple-300">Efeitos Ativos</h3>
      
      {/* Lista de efeitos ativos */}
      <div className="space-y-2">
        {exampleBuffs.length === 0 && exampleDebuffs.length === 0 ? (
          <p className="text-xs text-gray-400">Nenhum efeito ativo no momento</p>
        ) : (
          <>
            {/* Buffs */}
            {exampleBuffs.map(buff => (
              <motion.div
                key={buff.id}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                onClick={() => openEffectDetails(buff)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">{buff.icon}</span>
                  <div>
                    <p className="text-xs font-medium">{buff.name}</p>
                    <p className="text-xs text-green-400">+{buff.modifier} {buff.affects}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeRemaining(buff.duration)}
                </div>
              </motion.div>
            ))}
            
            {/* Debuffs */}
            {exampleDebuffs.map(debuff => (
              <motion.div
                key={debuff.id}
                className="bg-gray-700 bg-opacity-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                onClick={() => openEffectDetails(debuff)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center">
                  <span className="text-xl mr-2">{debuff.icon}</span>
                  <div>
                    <p className="text-xs font-medium">{debuff.name}</p>
                    <p className="text-xs text-red-400">{debuff.modifier} {debuff.affects}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeRemaining(debuff.duration)}
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
      
      {/* Modal com detalhes do efeito */}
      {selectedEffect && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedEffect(null)}
        >
          <motion.div
            className="bg-gray-800 rounded-lg max-w-md w-full p-4 relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{selectedEffect.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-purple-300">{selectedEffect.name}</h3>
                  <p className={`text-sm ${getEffectTypeColor(selectedEffect)}`}>
                    {selectedEffect.modifier > 0 ? '+' : ''}{selectedEffect.modifier} {selectedEffect.affects}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEffect(null)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-2">{selectedEffect.description}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Origem: {selectedEffect.source}</span>
                <span>Duração: {formatTimeRemaining(selectedEffect.duration)}</span>
              </div>
            </div>
            
            <div className="bg-purple-900 bg-opacity-30 p-3 rounded-lg border border-purple-800">
              <h4 className="text-sm font-bold text-purple-300 mb-1">Explicação Neurocientífica</h4>
              <p className="text-xs text-gray-300">{selectedEffect.neuroscience}</p>
              
              {/* Ações possíveis - apenas para demonstração */}
              <div className="mt-3 flex justify-end">
                {selectedEffect.modifier < 0 && (
                  <button 
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Em uma implementação real: mostraria instruções para remover o debuff
                      setSelectedEffect(null);
                    }}
                  >
                    Como remover
                  </button>
                )}
              </div>
            </div>
            
            {/* Feedback de aprendizado com reforço de progresso */}
            <div className="mt-4 text-xs text-center">
              <p className="text-purple-300">
                Aprender sobre estes efeitos aumenta sua <span className="font-bold">Autoconsciência Neurológica</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default StatusEffects; 