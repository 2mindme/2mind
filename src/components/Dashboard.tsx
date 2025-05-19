import React, { useState } from 'react';
import QuestPanel from './QuestPanel';
import LeaderboardPanel from './LeaderboardPanel';
import SkillTree from './SkillTree';
import UserAvatar from './UserAvatar';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Dashboard</h2>
          <UserAvatar />
        </div>
        
        <QuestPanel 
          quests={[]} 
          onCompleteQuest={() => {}} 
        />
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Árvore de Habilidades</h2>
        <SkillTree />
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Ranking</h2>
        <LeaderboardPanel />
      </div>
    </div>
  );
};

export default Dashboard; 