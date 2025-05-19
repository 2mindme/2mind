import React from 'react';
import { motion } from 'framer-motion';
import { Attributes } from '../types/gameTypes';

interface AttributeStatsProps {
  attributes: Attributes;
}

const AttributeStats: React.FC<AttributeStatsProps> = ({ attributes }) => {
  // Mapeia os atributos para ícones e cores
  const attributeDetails = {
    vitality: {
      icon: '❤️',
      label: 'Vitalidade',
      color: 'bg-red-500',
      description: 'Representa sua saúde física geral',
      tooltip: 'Influenciado por exercícios, alimentação e descanso',
    },
    energy: {
      icon: '⚡',
      label: 'Energia',
      color: 'bg-yellow-500',
      description: 'Representa seu nível de energia diária',
      tooltip: 'Influenciado por sono, nutrição e hidratação',
    },
    focus: {
      icon: '🎯',
      label: 'Foco',
      color: 'bg-blue-500',
      description: 'Representa sua capacidade de concentração',
      tooltip: 'Influenciado por hábitos de produtividade e estado mental',
    },
    mood: {
      icon: '😊',
      label: 'Humor',
      color: 'bg-green-500',
      description: 'Representa seu estado emocional',
      tooltip: 'Influenciado pelo equilíbrio dos outros atributos e atividades prazerosas',
    }
  };

  // Determina o efeito neurológico com base no valor do atributo
  const getNeurologicalEffect = (attribute: keyof Attributes) => {
    const value = attributes[attribute];
    
    if (value < 30) {
      return {
        status: 'Crítico',
        effect: attribute === 'vitality' ? 'Risco de esgotamento físico. Cortisol elevado e resposta inflamatória aumentada.' :
                attribute === 'energy' ? 'Déficit energético celular. Mitocôndrias com produção reduzida de ATP.' :
                attribute === 'focus' ? 'Desregulação dopaminérgica e funcionamento pré-frontal prejudicado.' :
                'Desequilíbrio de serotonina e função hipocampal reduzida.'
      };
    } else if (value < 60) {
      return {
        status: 'Moderado',
        effect: attribute === 'vitality' ? 'Funcionamento fisiológico básico. Homeostase mantida com esforço.' :
                attribute === 'energy' ? 'Produção energética adequada para funções básicas. Reservas limitadas.' :
                attribute === 'focus' ? 'Circuitos de atenção funcionais mas com alta taxa de alternância.' :
                'Regulação emocional básica com resilência moderada ao estresse.'
      };
    } else {
      return {
        status: 'Ótimo',
        effect: attribute === 'vitality' ? 'Sistemas fisiológicos otimizados. Reservas adaptativas elevadas.' :
                attribute === 'energy' ? 'Biogênese mitocondrial ativa e alta produção energética celular.' :
                attribute === 'focus' ? 'Redes de atenção estáveis com modulação dopaminérgica otimizada.' :
                'Equilíbrio serotonina-dopamina favorecendo estado anímico positivo e neuroplasticidade.'
      };
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {Object.entries(attributes).map(([key, value]) => {
        const attribute = key as keyof Attributes;
        const details = attributeDetails[attribute];
        const neurologicalEffect = getNeurologicalEffect(attribute);
        
        return (
          <div key={attribute} className="pb-2 relative group">
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <span className="mr-2">{details.icon}</span>
                <span>{details.label}</span>
              </div>
              <span className="font-bold">{value}/100</span>
            </div>
            
            <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${details.color}`}
                initial={{ width: '0%' }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, type: 'spring' }}
              />
            </div>
            
            {/* Status neurológico e tooltip informativo */}
            <div className="mt-1 flex justify-between text-xs">
              <span className={value < 30 ? 'text-red-400' : value < 60 ? 'text-yellow-400' : 'text-green-400'}>
                {neurologicalEffect.status}
              </span>
              
              {/* Tooltip com informação neurocientífica detalhada */}
              <div className="relative">
                <span className="cursor-help text-gray-400 underline">Info</span>
                <div className="absolute bottom-full right-0 mb-2 w-64 bg-gray-900 p-3 rounded-lg shadow-lg text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10 border border-purple-600">
                  <p className="font-bold mb-1">{details.description}</p>
                  <p className="text-gray-400 mb-2">{details.tooltip}</p>
                  <div className="border-t border-gray-700 pt-2">
                    <p className="text-purple-300 font-bold">Efeito Neurológico:</p>
                    <p>{neurologicalEffect.effect}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AttributeStats; 