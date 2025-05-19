import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserData } from '../types/gameTypes';

interface UserAvatarProps {
  userData: UserData;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userData }) => {
  const [showPersonaSelect, setShowPersonaSelect] = useState(false);
  
  // Calcula o nível médio de atributos para determinar a aparência visual
  const attributeAverage = Object.values(userData.attributes).reduce((sum, val) => sum + val, 0) / 
                          Object.values(userData.attributes).length;
  
  // Define a aparência do avatar com base nos atributos
  const getAvatarAppearance = () => {
    // Em uma implementação real, isso usaria imagens ou modelos 3D
    // Por enquanto, vamos usar apenas cores e efeitos para representar
    if (attributeAverage < 30) {
      return {
        borderColor: 'border-red-600',
        glowColor: 'shadow-red-900',
        auraEffect: 'opacity-30',
        statusText: 'Enfraquecido'
      };
    } else if (attributeAverage < 60) {
      return {
        borderColor: 'border-yellow-500',
        glowColor: 'shadow-yellow-900',
        auraEffect: 'opacity-60',
        statusText: 'Estável'
      };
    } else if (attributeAverage < 85) {
      return {
        borderColor: 'border-blue-500',
        glowColor: 'shadow-blue-900',
        auraEffect: 'opacity-80',
        statusText: 'Poderoso'
      };
    } else {
      return {
        borderColor: 'border-purple-500',
        glowColor: 'shadow-purple-900',
        auraEffect: 'opacity-100',
        statusText: 'Transcendente'
      };
    }
  };

  // Obtém a aparência visual atual
  const appearance = getAvatarAppearance();
  
  // Simulação de personas disponíveis
  const personas = [
    { id: 'default', name: 'Padrão', icon: '👤' },
    { id: 'ceo', name: 'CEO', icon: '💼' },
    { id: 'athlete', name: 'Atleta', icon: '🏃' },
    { id: 'scholar', name: 'Estudioso', icon: '📚' },
    { id: 'leader', name: 'Líder', icon: '👑' }
  ];
  
  // Função para alternar persona
  const changePersona = (personaId: string) => {
    // Em uma implementação real, isso alteraria o estado global
    // com a persona selecionada, modificando todos os atributos e aparência
    setShowPersonaSelect(false);
  };

  // Descrição do estado neurológico baseado na persona ativa
  const getNeuroDescription = () => {
    switch (userData.activePersona) {
      case 'ceo':
        return "Ativação elevada do córtex pré-frontal dorsolateral, associado à tomada de decisão estratégica e foco executivo.";
      case 'athlete':
        return "Otimização dos circuitos motores e aumento da eficiência do sistema dopaminérgico durante atividades físicas.";
      case 'scholar':
        return "Aumento da conectividade entre hipocampo e córtex frontal, favorecendo consolidação de memória e aprendizado.";
      case 'leader':
        return "Elevação dos níveis de ocitocina e equilibrio cortisol-testosterona, favorecendo comportamentos sociais assertivos.";
      default:
        return "Estado neurológico base, com equilíbrio homeostático entre sistemas de recompensa, atenção e regulação emocional.";
    }
  };

  // Função para simular um "pulso" visual quando ocorre uma mudança positiva
  const triggerPulseEffect = () => {
    // Este efeito seria chamado externamente quando o usuário ganha experiência/nível
  };

  return (
    <div className="relative">
      {/* Avatar principal com efeitos visuais */}
      <motion.div 
        className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${appearance.borderColor} shadow-lg ${appearance.glowColor}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPersonaSelect(!showPersonaSelect)}
      >
        {/* Placeholder para imagem de avatar real */}
        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl">
          {personas.find(p => p.id === userData.activePersona)?.icon || '👤'}
        </div>
        
        {/* Aura de energia - representando nível e poder */}
        <motion.div 
          className={`absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mix-blend-overlay ${appearance.auraEffect}`}
          animate={{ 
            opacity: [appearance.auraEffect.split('-')[1], (Number(appearance.auraEffect.split('-')[1]) * 0.7), appearance.auraEffect.split('-')[1]],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
      
      {/* Indicador de nível */}
      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-purple-300">
        {userData.level}
      </div>
      
      {/* Status do avatar */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-0.5 rounded-full text-xs border border-gray-700 whitespace-nowrap">
        <span className={`
          ${appearance.statusText === 'Enfraquecido' ? 'text-red-400' : ''}
          ${appearance.statusText === 'Estável' ? 'text-yellow-400' : ''}
          ${appearance.statusText === 'Poderoso' ? 'text-blue-400' : ''}
          ${appearance.statusText === 'Transcendente' ? 'text-purple-400' : ''}
        `}>
          {appearance.statusText}
        </span>
      </div>
      
      {/* Seletor de personas - mostrado apenas quando clicado */}
      {showPersonaSelect && (
        <motion.div 
          className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-700 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2 w-48">
            <h3 className="text-sm font-bold text-purple-300 mb-2">Alternar Persona</h3>
            
            {personas.map(persona => (
              <div 
                key={persona.id}
                className={`flex items-center p-2 rounded hover:bg-gray-700 cursor-pointer ${userData.activePersona === persona.id ? 'bg-gray-700 border-l-2 border-purple-500' : ''}`}
                onClick={() => changePersona(persona.id)}
              >
                <span className="text-xl mr-2">{persona.icon}</span>
                <div>
                  <p className="text-sm font-medium">{persona.name}</p>
                  {userData.activePersona === persona.id && (
                    <p className="text-xs text-gray-400">Ativa</p>
                  )}
                </div>
              </div>
            ))}
            
            <div className="mt-3 border-t border-gray-700 pt-2">
              <p className="text-xs text-purple-300 font-bold">Estado Neurológico:</p>
              <p className="text-xs text-gray-400 mt-1">{getNeuroDescription()}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserAvatar; 