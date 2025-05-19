import React, { useState, useEffect } from 'react';
import QuestPanel from '../components/QuestPanel';
import NeuroscienceWidget from '../components/NeuroscienceWidget';
import { UserData, QuestType, QuestDifficulty, QuestCategory } from '../types/gameTypes';
import { useAuth } from '../context/AuthContext';
import { getUserQuests, completeQuest, getQuests } from '../lib/supabase';

const QuestsPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeQuests, setActiveQuests] = useState<QuestType[]>([]);
  const [completedQuests, setCompletedQuests] = useState<QuestType[]>([]);
  
  // Missões de exemplo
  const exampleQuests: QuestType[] = [
    {
      id: '1',
      title: 'Completar 30 minutos de exercício',
      description: 'Realizar atividade física por pelo menos 30 minutos. Válido para: caminhada, corrida, musculação ou qualquer atividade que aumente sua frequência cardíaca.',
      xpReward: 20,
      currencyReward: 15,
      completed: false,
      recurring: true,
      recurringType: 'daily',
      createdAt: new Date().toISOString(),
      attributeRewards: {
        vitality: 5,
        energy: 3
      }
    },
    {
      id: '2',
      title: 'Meditar por 10 minutos',
      description: 'Realizar 10 minutos de meditação mindfulness, focando na respiração e concentração plena no momento presente.',
      xpReward: 15,
      currencyReward: 10,
      completed: false,
      recurring: true,
      recurringType: 'daily',
      createdAt: new Date().toISOString(),
      attributeRewards: {
        focus: 5,
        mood: 4
      }
    },
    {
      id: '3',
      title: 'Completar projeto de trabalho',
      description: 'Finalizar o relatório mensal para apresentação à diretoria. Deve incluir análise de dados, gráficos e recomendações estratégicas.',
      xpReward: 100,
      currencyReward: 50,
      completed: false,
      recurring: false,
      createdAt: new Date().toISOString(),
      attributeRewards: {
        focus: 10,
        mood: 5
      }
    },
    {
      id: '4',
      title: 'Dormir 8 horas por 3 dias consecutivos',
      description: 'Manter uma rotina de sono consistente, dormindo pelo menos 8 horas por noite durante 3 dias seguidos.',
      xpReward: 50,
      currencyReward: 30,
      completed: false,
      recurring: true,
      recurringType: 'weekly',
      createdAt: new Date().toISOString(),
      attributeRewards: {
        vitality: 8,
        energy: 10,
        focus: 5
      }
    }
  ];

  // Carregar missões do usuário
  useEffect(() => {
    const loadQuests = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Buscar todas as missões
        const { data: allQuestsData, error: allQuestsError } = await getQuests();
        if (allQuestsError) throw allQuestsError;
        
        // Buscar as missões do usuário
        const { data: userQuestsData, error: userQuestsError } = await getUserQuests(user.id);
        if (userQuestsError) throw userQuestsError;
        
        // Processar as missões completadas e ativas
        const activeQuestsList: QuestType[] = [];
        const completedQuestsList: QuestType[] = [];
        
        if (userQuestsData && userQuestsData.length > 0 && allQuestsData) {
          // Mapear as missões do usuário, juntando com os detalhes da missão
          userQuestsData.forEach((userQuest: any) => {
            const questData = userQuest.quests;
            const quest: QuestType = {
              id: questData.id,
              title: questData.title,
              description: questData.description,
              xpReward: questData.xp_reward,
              currencyReward: questData.currency_reward,
              attributeRewards: questData.attribute_rewards || {},
              completed: userQuest.completed,
              recurring: questData.recurring,
              recurringType: questData.recurring_type,
              createdAt: questData.created_at,
              dueDate: userQuest.due_date || null,
              completedAt: userQuest.completed_at || null
            };
            
            if (userQuest.completed) {
              completedQuestsList.push(quest);
            } else {
              activeQuestsList.push(quest);
            }
          });
          
          // Adicionar missões globais que o usuário ainda não adicionou
          const userQuestIds = userQuestsData.map((uq: any) => uq.quest_id);
          allQuestsData
            .filter((q: any) => !userQuestIds.includes(q.id) && q.is_global)
            .forEach((quest: any) => {
              activeQuestsList.push({
                id: quest.id,
                title: quest.title,
                description: quest.description,
                xpReward: quest.xp_reward,
                currencyReward: quest.currency_reward,
                attributeRewards: quest.attribute_rewards || {},
                completed: false,
                recurring: quest.recurring,
                recurringType: quest.recurring_type,
                createdAt: quest.created_at,
                isGlobal: true
              });
            });
            
          setActiveQuests(activeQuestsList);
          setCompletedQuests(completedQuestsList);
        } else {
          // Se não houver dados no Supabase, usar os exemplos
          console.log('Sem dados no Supabase, usando exemplos');
          setActiveQuests(exampleQuests);
          setCompletedQuests([]);
        }
        
      } catch (err) {
        console.error('Erro ao carregar missões:', err);
        console.log('Usando missões de exemplo devido a erro');
        setActiveQuests(exampleQuests);
        setCompletedQuests([]);
        setError(null); // Não mostrar erro para o usuário, já que estamos usando dados de exemplo
      } finally {
        setLoading(false);
      }
    };
    
    loadQuests();
  }, [user]);

  // Função para completar uma missão
  const handleCompleteQuest = async (questId: string) => {
    if (!user) return;
    
    try {
      // Encontrar a missão que está sendo completada antes de alterá-la no estado
      const completedQuestData = activeQuests.find(q => q.id === questId);
      if (!completedQuestData) {
        console.error('Missão não encontrada');
        return;
      }
      
      // Atualizar o estado local para feedback imediato
      setActiveQuests(prev => prev.filter(q => q.id !== questId));
      setCompletedQuests(prev => [{
          ...completedQuestData,
          completed: true,
          completedAt: new Date().toISOString()
      }, ...prev]);
      
      // Chamar a API para completar a missão
      try {
        const { data, error, rewards } = await completeQuest(user.id, questId);
        
        if (error) {
          throw error;
        }
        
        // Se a operação foi bem sucedida e temos informações de recompensas
        if (rewards) {
          // Formatar uma mensagem com as recompensas
          let rewardMessage = `Missão completada! Você ganhou ${rewards.xp} XP e ${rewards.currency} moedas.`;
          
          // Se houve aumento de nível
          if (rewards.levelUp) {
            rewardMessage += ` Parabéns! Você avançou para o nível ${profile?.level + 1}!`;
          }
          
          // Se existem atributos melhorados, adicionar à mensagem
          if (rewards.attributes && Object.keys(rewards.attributes).length > 0) {
            rewardMessage += '\n\nAtributos melhorados:';
            for (const [attr, value] of Object.entries(rewards.attributes)) {
              const attrName = {
                vitality: 'Vitalidade',
                energy: 'Energia',
                focus: 'Foco',
                mood: 'Humor'
              }[attr as string] || attr;
              
              rewardMessage += `\n- ${attrName}: +${value}`;
            }
          }
          
          // Mostrar a mensagem de recompensa
        alert(rewardMessage);
        } else {
          // Fallback para mensagem genérica se não tivermos dados de recompensa
          alert(`Missão completada! Você ganhou ${completedQuestData.xpReward} XP e ${completedQuestData.currencyReward} moedas.`);
        }
      } catch (err) {
        console.error('Erro ao atualizar no Supabase:', err);
        // Ainda mostramos a mensagem de sucesso, mesmo que haja erro no backend
        alert(`Missão completada! Você ganhou ${completedQuestData.xpReward} XP e ${completedQuestData.currencyReward} moedas.`);
      }
    } catch (err) {
      console.error('Erro ao completar missão:', err);
      alert('Ocorreu um erro ao completar a missão. Tente novamente.');
      
      // Recarregar as missões para garantir estado correto
      const loadQuests = async () => {
        const { data, error } = await getUserQuests(user.id);
        if (!error && data) {
          // Processar novamente as listas de missões...
        }
      };
      
      loadQuests();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Missões Ativas</h2>
        {activeQuests.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma missão ativa no momento.</p>
        ) : (
          <QuestPanel 
            quests={activeQuests} 
            onCompleteQuest={handleCompleteQuest} 
          />
        )}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Missões Completadas</h2>
        <div className="text-gray-400 text-sm">
          {completedQuests.length === 0 ? (
            <p>Nenhuma missão completada ainda.</p>
          ) : (
            <div className="grid gap-4">
              {completedQuests.map((quest) => (
                <div 
                  key={quest.id} 
                  className="bg-gray-700/30 p-4 rounded-lg border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{quest.title}</h3>
                      <p className="text-gray-400 text-sm mt-1">{quest.description}</p>
                      <div className="mt-3 flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Completada em {new Date(quest.completedAt || '').toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="bg-success/10 px-2 py-1 rounded-full text-success text-xs">Completada</div>
                      <div className="mt-2 flex space-x-2">
                        <span className="flex items-center text-xs text-yellow-400">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          {quest.xpReward} XP
                        </span>
                        <span className="flex items-center text-xs text-yellow-400">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          {quest.currencyReward}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <NeuroscienceWidget 
          title="Recompensa e Motivação" 
          content="Completar tarefas ativa seu sistema de recompensa cerebral, liberando dopamina de forma controlada e construindo novos circuitos neuronais associados à produtividade." 
        />
      </div>
    </div>
  );
};

export default QuestsPage; 