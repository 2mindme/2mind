import React, { useState, useEffect } from 'react';
import AttributeStats from '../components/AttributeStats';
import StatusEffects from '../components/StatusEffects';
import { UserData } from '../types/gameTypes';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, getUserAttributes } from '../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userData, setUserData] = useState<UserData>({
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

  // Dados pessoais simulados baseados no formulário de onboarding
  const [userProfile, setUserProfile] = useState({
    name: profile?.name || 'Caçador Solo',
    age: '28',
    gender: 'masculino',
    email: user?.email || 'user@test.com',
    height: '175',
    weight: '70',
    activityLevel: 'moderado',
    educationLevel: 'graduacao',
    readingFrequency: 'regular',
    relationshipStatus: 'solteiro',
    socialCircleSize: 'medio',
    incomeRange: 'prefiro_nao_dizer'
  });

  // Carregar os dados do usuário do Supabase
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          // Se não houver usuário, apenas use dados fictícios
          console.log('Sem usuário autenticado, usando dados fictícios');
          setLoading(false);
          return;
        }
        
        // Carregar atributos do usuário
        try {
          const { data: attributesData, error: attributesError } = await getUserAttributes(user.id);
          
          if (attributesError) {
            console.warn('Erro ao carregar atributos:', attributesError);
          } else if (attributesData) {
            // O getUserAttributes retorna um array, então pegamos o primeiro item
            const userAttributes = Array.isArray(attributesData) && attributesData.length > 0 
              ? attributesData[0] 
              : null;
            
            if (userAttributes) {
              // Atualizar atributos se disponíveis
              setUserData(prev => ({
                ...prev,
                attributes: {
                  vitality: userAttributes.vitality || prev.attributes.vitality,
                  energy: userAttributes.energy || prev.attributes.energy,
                  focus: userAttributes.focus || prev.attributes.focus,
                  mood: userAttributes.mood || prev.attributes.mood
                }
              }));
            }
          }
        } catch (err) {
          console.error('Erro na chamada de atributos:', err);
        }

        if (profile?.onboarding_data) {
          const onboardingData = profile.onboarding_data;
          
          // Atualizar o perfil com os dados do onboarding
          setUserProfile({
            name: profile.name || 'Usuário',
            age: onboardingData.age || '28',
            gender: onboardingData.physical?.gender || 'masculino',
            email: user.email || 'user@test.com',
            height: onboardingData.physical?.height?.toString() || '175',
            weight: onboardingData.physical?.weight?.toString() || '70',
            activityLevel: onboardingData.physical?.activity_level || 'moderado',
            educationLevel: onboardingData.intellectual?.education_level || 'graduacao',
            readingFrequency: onboardingData.intellectual?.reading_frequency || 'regular',
            relationshipStatus: onboardingData.emotional?.relationship_status || 'solteiro',
            socialCircleSize: onboardingData.social?.social_circle_size || 'medio',
            incomeRange: onboardingData.financial?.income_range || 'prefiro_nao_dizer'
          });
        }
        
        // Atualizar os dados do usuário
        setUserData(prev => ({
          ...prev,
          id: user.id,
          name: profile?.name || 'Usuário',
          level: profile?.level || 1,
          experience: profile?.experience || 0,
          activePersona: profile?.active_persona || 'default',
          currency: profile?.currency || 100,
        }));
        
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError('Não foi possível carregar seus dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user, profile]);

  // Dados do ranking do usuário
  const [rankData] = useState({
    currentRank: 'C',
    position: 42,
    pointsToNextRank: 120,
    nextRank: 'B',
    achivementsCount: 12,
    questsCompleted: 57
  });

  // Estados para controlar a edição
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...userProfile});
  const [updating, setUpdating] = useState(false);

  // Opções para os selects (mesmas do formulário de onboarding)
  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' },
    { value: 'prefiro_nao_dizer', label: 'Prefiro não dizer' }
  ];

  const activityLevelOptions = [
    { value: 'sedentario', label: 'Sedentário (pouco ou nenhum exercício)' },
    { value: 'leve', label: 'Levemente ativo (exercício leve 1-3 dias/semana)' },
    { value: 'moderado', label: 'Moderadamente ativo (exercício moderado 3-5 dias/semana)' },
    { value: 'intenso', label: 'Muito ativo (exercício intenso 6-7 dias/semana)' },
    { value: 'extremo', label: 'Extremamente ativo (exercício intenso diário ou atleta)' }
  ];

  const educationOptions = [
    { value: 'ensino_fundamental', label: 'Ensino Fundamental' },
    { value: 'ensino_medio', label: 'Ensino Médio' },
    { value: 'tecnico', label: 'Curso Técnico' },
    { value: 'graduacao', label: 'Graduação' },
    { value: 'pos_graduacao', label: 'Pós-Graduação' },
    { value: 'mestrado', label: 'Mestrado' },
    { value: 'doutorado', label: 'Doutorado' }
  ];

  const readingOptions = [
    { value: 'nunca', label: 'Raramente ou nunca' },
    { value: 'ocasional', label: 'Ocasionalmente (alguns livros por ano)' },
    { value: 'regular', label: 'Regularmente (um livro por mês)' },
    { value: 'frequente', label: 'Frequentemente (vários livros por mês)' },
    { value: 'diario', label: 'Diariamente (leio todos os dias)' }
  ];

  const relationshipOptions = [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'namorando', label: 'Namorando' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'uniao_estavel', label: 'União estável' },
    { value: 'separado', label: 'Separado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' },
    { value: 'prefiro_nao_dizer', label: 'Prefiro não dizer' }
  ];

  const socialCircleOptions = [
    { value: 'muito_pequeno', label: 'Muito pequeno (1-2 pessoas próximas)' },
    { value: 'pequeno', label: 'Pequeno (3-5 pessoas próximas)' },
    { value: 'medio', label: 'Médio (6-10 pessoas próximas)' },
    { value: 'grande', label: 'Grande (11-20 pessoas próximas)' },
    { value: 'muito_grande', label: 'Muito grande (mais de 20 pessoas próximas)' }
  ];

  const incomeOptions = [
    { value: 'prefiro_nao_dizer', label: 'Prefiro não informar' },
    { value: 'ate_1000', label: 'Até R$ 1.000' },
    { value: '1001_3000', label: 'R$ 1.001 a R$ 3.000' },
    { value: '3001_5000', label: 'R$ 3.001 a R$ 5.000' },
    { value: '5001_10000', label: 'R$ 5.001 a R$ 10.000' },
    { value: 'acima_10000', label: 'Acima de R$ 10.000' }
  ];

  // Cores para os ranks (ordem decrescente: E, D, C, B, A, S)
  const rankColors = {
    'E': 'text-gray-500',
    'D': 'text-green-500',
    'C': 'text-blue-500',
    'B': 'text-purple-500',
    'A': 'text-amber-500',
    'S': 'text-red-500'
  };

  // Função para determinar o próximo rank
  const getNextRank = (currentRank: string) => {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const currentIndex = ranks.indexOf(currentRank);
    return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
  };

  // Handler para mudanças no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [id]: value }));
  };

  // Salvar alterações no perfil
  const saveChanges = async () => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      // Preparar os dados a serem atualizados
      const updateData = {
        name: editedProfile.name,
        onboarding_data: {
          ...profile?.onboarding_data,
          age: editedProfile.age,
          physical: {
            ...profile?.onboarding_data?.physical,
            height: parseFloat(editedProfile.height),
            weight: parseFloat(editedProfile.weight),
            activity_level: editedProfile.activityLevel,
            gender: editedProfile.gender
          },
          intellectual: {
            ...profile?.onboarding_data?.intellectual,
            education_level: editedProfile.educationLevel,
            reading_frequency: editedProfile.readingFrequency
          },
          emotional: {
            ...profile?.onboarding_data?.emotional,
            relationship_status: editedProfile.relationshipStatus
          },
          social: {
            ...profile?.onboarding_data?.social,
            social_circle_size: editedProfile.socialCircleSize
          },
          financial: {
            ...profile?.onboarding_data?.financial,
            income_range: editedProfile.incomeRange
          }
        }
      };
      
      // Atualizar no Supabase
      try {
        const { error } = await updateUserProfile(user.id, updateData);
        
        if (error) {
          throw error;
        }
        
        // Atualizar o contexto local
        await updateProfile(updateData);
      } catch (err) {
        console.error('Erro ao atualizar no Supabase:', err);
        // Mesmo com erro no Supabase, continuamos atualizando a UI localmente
      }
      
      // Atualizar o estado local
      setUserProfile(editedProfile);
      setIsEditing(false);
      
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  // Cancelar edição
  const cancelEdit = () => {
    setEditedProfile({...userProfile});
    setIsEditing(false);
  };

  // Funções para obter label baseado no valor
  const getLabelFromValue = (value: string, options: {value: string, label: string}[]) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 max-w-md">
          <div className="text-center">
            <svg className="w-12 h-12 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar dados</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do perfil */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 border-2 border-gray-600">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border border-gray-500">
              {userData.level}
            </div>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                <p className="text-gray-400">Nível {userData.level}</p>
              </div>
              
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 px-4 py-2 bg-info/20 text-info border border-info/30 rounded-lg text-sm hover:bg-info/30 transition"
                >
                  Editar Perfil
                </button>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-center md:justify-start text-sm text-gray-400 mb-1">
                <span>Experiência: {userData.experience}/100</span>
              </div>
              <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-info/80 h-2 rounded-full" 
                  style={{ width: `${userData.experience}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações de Rank */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">Estatísticas de Progresso</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold mb-1 ${rankColors[rankData.currentRank as keyof typeof rankColors]}`}>
              {rankData.currentRank}
            </div>
            <p className="text-gray-400 text-sm">Rank Atual</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-white">#{rankData.position}</div>
            <p className="text-gray-400 text-sm">Posição no Ranking</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-white">{rankData.pointsToNextRank}</div>
            <p className="text-gray-400 text-sm">Pontos para {getNextRank(rankData.currentRank)}</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-yellow-400">{rankData.questsCompleted}</div>
            <p className="text-gray-400 text-sm">Missões Completadas</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-green-400">{rankData.achivementsCount}</div>
            <p className="text-gray-400 text-sm">Conquistas</p>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold mb-1 text-purple-400">{userData.currency}</div>
            <p className="text-gray-400 text-sm">Moedas</p>
          </div>
        </div>
      </div>

      {/* Formulário de edição ou visualização de dados pessoais */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">Informações Pessoais</h2>
        
        {isEditing ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input
                  id="name"
                  type="text"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Idade</label>
                <input
                  id="age"
                  type="number"
                  value={editedProfile.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={editedProfile.email}
                  onChange={handleChange}
                  disabled
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 focus:outline-none cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300 mb-1">Gênero</label>
                <select
                  id="gender"
                  value={editedProfile.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Altura (cm)</label>
                <input
                  id="height"
                  type="number"
                  value={editedProfile.height}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Peso (kg)</label>
                <input
                  id="weight"
                  type="number"
                  value={editedProfile.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                />
              </div>
              
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-300 mb-1">Nível de Atividade</label>
                <select
                  id="activityLevel"
                  value={editedProfile.activityLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {activityLevelOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-300 mb-1">Nível de Educação</label>
                <select
                  id="educationLevel"
                  value={editedProfile.educationLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {educationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="readingFrequency" className="block text-sm font-medium text-gray-300 mb-1">Frequência de Leitura</label>
                <select
                  id="readingFrequency"
                  value={editedProfile.readingFrequency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {readingOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="relationshipStatus" className="block text-sm font-medium text-gray-300 mb-1">Status de Relacionamento</label>
                <select
                  id="relationshipStatus"
                  value={editedProfile.relationshipStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {relationshipOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="socialCircleSize" className="block text-sm font-medium text-gray-300 mb-1">Tamanho do Círculo Social</label>
                <select
                  id="socialCircleSize"
                  value={editedProfile.socialCircleSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {socialCircleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-300 mb-1">Faixa de Renda</label>
                <select
                  id="incomeRange"
                  value={editedProfile.incomeRange}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-info"
                >
                  {incomeOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white hover:bg-gray-600/50 transition"
                disabled={updating}
              >
                Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-info text-white rounded-lg hover:bg-info/90 transition disabled:opacity-50"
                disabled={updating}
              >
                {updating ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Salvando...
                  </span>
                ) : (
                  'Salvar Alterações'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nome</h3>
              <p className="text-white">{userProfile.name}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Idade</h3>
              <p className="text-white">{userProfile.age} anos</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-white">{userProfile.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gênero</h3>
              <p className="text-white">{getLabelFromValue(userProfile.gender, genderOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Altura</h3>
              <p className="text-white">{userProfile.height} cm</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Peso</h3>
              <p className="text-white">{userProfile.weight} kg</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nível de Atividade</h3>
              <p className="text-white">{getLabelFromValue(userProfile.activityLevel, activityLevelOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Educação</h3>
              <p className="text-white">{getLabelFromValue(userProfile.educationLevel, educationOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Frequência de Leitura</h3>
              <p className="text-white">{getLabelFromValue(userProfile.readingFrequency, readingOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status de Relacionamento</h3>
              <p className="text-white">{getLabelFromValue(userProfile.relationshipStatus, relationshipOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Círculo Social</h3>
              <p className="text-white">{getLabelFromValue(userProfile.socialCircleSize, socialCircleOptions)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Faixa de Renda</h3>
              <p className="text-white">{getLabelFromValue(userProfile.incomeRange, incomeOptions)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">Atributos Neurais</h2>
        {(() => {
          try {
            return <AttributeStats attributes={userData.attributes} />;
          } catch (error) {
            console.error('Erro ao renderizar AttributeStats:', error);
            return (
              <div className="text-gray-400 text-sm p-4 bg-gray-800 rounded-lg">
                <p>Não foi possível carregar os atributos. Por favor, tente novamente mais tarde.</p>
              </div>
            );
          }
        })()}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">Status Ativos</h2>
        {(() => {
          try {
            return (
              <StatusEffects 
                buffs={userData.activeBuffs} 
                debuffs={userData.activeDebuffs} 
              />
            );
          } catch (error) {
            console.error('Erro ao renderizar StatusEffects:', error);
            return (
              <div className="text-gray-400 text-sm p-4 bg-gray-800 rounded-lg">
                <p>Não foi possível carregar os status ativos. Por favor, tente novamente mais tarde.</p>
              </div>
            );
          }
        })()}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h2 className="text-xl font-bold mb-4 text-white">Conquistas</h2>
        <div className="text-gray-400 text-sm">
          {userData.achievements.length === 0 ? (
            <p>Nenhuma conquista desbloqueada ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aqui seria a lista de conquistas */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 