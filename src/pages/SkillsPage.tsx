import React, { useState } from 'react';
import SkillTree from '../components/SkillTree';
import NeuroscienceWidget from '../components/NeuroscienceWidget';
import { UserData } from '../types/gameTypes';

const SkillsPage: React.FC = () => {
  const [userData] = useState<UserData>({
    id: '1',
    name: 'Caçador Solo',
    level: 1,
    experience: 0,
    attributes: {
      vitality: 50,
      energy: 60,
      focus: 40,
      mood: 55
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

  return (
    <div className="space-y-6">
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Árvore de Habilidades</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Desenvolva habilidades específicas baseadas em neurociência para fortalecer sua capacidade cerebral.
        </p>
        <SkillTree userData={userData} />
      </div>
      
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <NeuroscienceWidget 
          title="Neuroplasticidade" 
          content="A prática consistente de habilidades específicas fortalece as conexões neurais, criando redes mais eficientes através da neuroplasticidade - a capacidade do cérebro de se reorganizar." 
        />
      </div>
    </div>
  );
};

export default SkillsPage; 