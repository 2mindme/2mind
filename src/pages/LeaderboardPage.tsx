import React, { useState, useEffect } from 'react';
import LeaderboardPanel from '../components/LeaderboardPanel';
import NeuroscienceWidget from '../components/NeuroscienceWidget';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../lib/supabase';

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<any>({
    daily: [],
    weekly: [],
    monthly: []
  });
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        setLoading(true);
        
        // Carregar dados de classificação para cada período
        const periods: ('daily' | 'weekly' | 'monthly')[] = ['daily', 'weekly', 'monthly'];
        
        for (const period of periods) {
          const { data, error } = await getLeaderboard(period);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setLeaderboardData(prev => ({
              ...prev,
              [period]: data
            }));
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados de classificação:', err);
        setError('Não foi possível carregar o ranking. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadLeaderboardData();
  }, []);

  const handleTimeframeChange = (newTimeframe: 'daily' | 'weekly' | 'monthly') => {
    setTimeframe((prev: 'daily' | 'weekly' | 'monthly') => newTimeframe);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Ranking Global</h2>
        <p className="text-gray-400 mb-6 text-sm">
          Compare seu progresso com outros usuários e acompanhe sua evolução.
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
          </div>
        ) : error ? (
          <div className="bg-danger/20 border border-danger/30 rounded-lg p-4 text-white">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-danger text-white rounded-lg text-sm hover:bg-danger/90 transition"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <LeaderboardPanel 
            leaderboardData={leaderboardData} 
            currentUserId={user?.id}
          />
        )}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <NeuroscienceWidget 
          title="Motivação Social" 
          content="A comparação social moderada ativa sistemas cerebrais de cooperação e competição saudável, estimulando a liberação de dopamina como motivador natural para o desenvolvimento pessoal." 
        />
      </div>
    </div>
  );
};

export default LeaderboardPage; 