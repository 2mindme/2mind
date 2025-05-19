import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ulccwnhalbnqoqtmdxkl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsY2N3bmhhbGJucW9xdG1keGtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODkzMTUsImV4cCI6MjA2MTk2NTMxNX0.OkFG4HTwbG4BVh19tCPu79X3uGdckE3Fy5ttF1Pcj-8';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para obter o usuário atual
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Função para registrar um novo usuário
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

// Função para fazer login
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// Função para fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Função para obter o perfil do usuário
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

// Função para atualizar o perfil do usuário
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  return { data, error };
};

// Função para obter missões
export const getQuests = async () => {
  try {
    const { data, error } = await supabase
      .from('quests')
      .select('*');

    if (error) throw error;

    const quests = data.map((quest: any) => ({
      id: quest.id,
      title: quest.title,
      description: quest.description,
      xpReward: quest.xp_reward,
      recurring: quest.recurring,
      recurringType: quest.recurring_type,
      statBoosts: quest.stat_boosts || {}
    }));

    return { data: quests, error: null };
  } catch (error) {
    console.error('Erro ao buscar quests:', error);
    return { data: null, error };
  }
};

// Função para obter missões de um usuário
export const getUserQuests = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_quests')
    .select('*, quests(*)')
    .eq('user_id', userId);
  return { data, error };
};

// Função para completar uma missão
export const completeQuest = async (userId: string, questId: string) => {
  try {
    // 1. Atualizar o status da quest para completado
    const { data, error } = await supabase
      .from('user_quests')
      .update({ 
        status: 'completed', 
        progress: 100,
        completed_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('quest_id', questId)
      .select();
    
    if (error) throw error;
    
    // 2. Obter recompensas da missão
    const { data: questData, error: questError } = await supabase
      .from('quests')
      .select('xp_reward, currency_reward, attribute_rewards')
      .eq('id', questId)
      .single();
    
    if (questError) throw questError;
    
    if (questData) {
      // 3. Atualizar experiência e moedas do usuário
      const { success, error: rewardError, levelUp } = await addUserRewards(
        userId, 
        questData.xp_reward || 0, 
        questData.currency_reward || 0
      );
      
      if (rewardError) console.error('Erro ao adicionar recompensas:', rewardError);
      
      // 4. Se tiver recompensas de atributos, atualizar atributos
      if (questData.attribute_rewards) {
        const { data: attributes, error: attrError } = await supabase
          .from('user_attributes')
          .select('*')
          .eq('user_id', userId)
          .single();
        
        if (!attrError && attributes) {
          const updates: any = {};
          const rewards = questData.attribute_rewards;
          
          if (rewards.vitality) updates.vitality = Math.min(100, attributes.vitality + rewards.vitality);
          if (rewards.energy) updates.energy = Math.min(100, attributes.energy + rewards.energy);
          if (rewards.focus) updates.focus = Math.min(100, attributes.focus + rewards.focus);
          if (rewards.mood) updates.mood = Math.min(100, attributes.mood + rewards.mood);
          
          if (Object.keys(updates).length > 0) {
            await supabase
              .from('user_attributes')
              .update(updates)
              .eq('user_id', userId);
          }
        }
      }
      
      return { 
        data, 
        error: null,
        rewards: {
          xp: questData.xp_reward,
          currency: questData.currency_reward,
          attributes: questData.attribute_rewards,
          levelUp
        }
      };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao completar missão:', error);
    return { data: null, error };
  }
};

// Função para obter habilidades
export const getSkills = async () => {
  const { data, error } = await supabase
    .from('skills')
    .select('*');
  return { data, error };
};

// Função para obter habilidades de um usuário
export const getUserSkills = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_skills')
    .select('*, skills(*)')
    .eq('user_id', userId);
  return { data, error };
};

// Função para adquirir uma habilidade
export const acquireSkill = async (userId: string, skillId: string, level: number = 1) => {
  const { data, error } = await supabase
    .from('user_skills')
    .insert([
      { user_id: userId, skill_id: skillId, level }
    ])
    .select();
  return { data, error };
};

// Função para atualizar uma habilidade
export const upgradeSkill = async (userId: string, skillId: string, level: number) => {
  const { data, error } = await supabase
    .from('user_skills')
    .update({ level })
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .select();
  return { data, error };
};

// Função para obter o ranking global
export const getLeaderboard = async (timeframe: 'daily' | 'weekly' | 'monthly' = 'weekly', limit: number = 10) => {
  // Presumindo que existe uma tabela 'leaderboard' que armazena o ranking
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('timeframe', timeframe)
    .order('position', { ascending: true })
    .limit(limit);
  return { data, error };
};

// Função para obter os itens da loja
export const getStoreItems = async () => {
  const { data, error } = await supabase
    .from('store_items')
    .select('*');
  return { data, error };
};

// Função para comprar um item
export const purchaseItem = async (userId: string, itemId: string) => {
  // Primeiro, verificamos se o usuário tem moedas suficientes
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('currency')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    return { success: false, error: userError || new Error('Usuário não encontrado') };
  }

  // Obter o preço do item
  const { data: itemData, error: itemError } = await supabase
    .from('store_items')
    .select('price')
    .eq('id', itemId)
    .single();

  if (itemError || !itemData) {
    return { success: false, error: itemError || new Error('Item não encontrado') };
  }

  // Verificar se o usuário tem moedas suficientes
  if (userData.currency < itemData.price) {
    return { success: false, error: new Error('Moedas insuficientes') };
  }

  // Iniciar transação para compra
  const { data: transaction, error: transactionError } = await supabase.rpc('purchase_item', {
    p_user_id: userId,
    p_item_id: itemId,
    p_price: itemData.price
  });

  return { success: !!transaction, error: transactionError };
};

// Função para obter os atributos do usuário
export const getUserAttributes = async (userId: string) => {
  // Primeiro verifica se os atributos existem
  const { data, error } = await supabase
    .from('user_attributes')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Se não existirem atributos, cria um conjunto padrão
  if (error || !data) {
    const defaultAttributes = {
      user_id: userId,
      vitality: 50,
      energy: 60,
      focus: 40,
      mood: 55,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: createdData, error: createError } = await supabase
      .from('user_attributes')
      .insert([defaultAttributes])
      .select();

    if (createError) {
      console.error("Erro ao criar atributos padrão:", createError);
      return { data: defaultAttributes, error: null };
    }

    return { data: createdData?.[0] || defaultAttributes, error: null };
  }

  return { data, error };
};

// Função para atualizar os atributos de um usuário
export const updateUserAttributes = async (userId: string, attributes: any) => {
  const { data, error } = await supabase
    .from('user_attributes')
    .update(attributes)
    .eq('user_id', userId)
    .select();
  return { data, error };
};

// Função para obter os dados físicos de um usuário
export const getPhysicalData = async (userId: string) => {
  const { data, error } = await supabase
    .from('physical_data')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  return { data, error };
};

// Função para adicionar dados físicos
export const addPhysicalData = async (userId: string, physicalData: any) => {
  const { data, error } = await supabase
    .from('physical_data')
    .insert([
      { user_id: userId, ...physicalData }
    ])
    .select();
  return { data, error };
};

// Função para verificar se é o primeiro login do usuário
export const isFirstLogin = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('has_completed_onboarding')
    .eq('id', userId)
    .single();
  
  if (error || !data) {
    return { isFirst: true, error };
  }
  
  return { isFirst: !data.has_completed_onboarding, error: null };
};

// Função para marcar o onboarding como concluído
export const completeOnboarding = async (userId: string, profileData: any) => {
  try {
    // 1. Atualizar o perfil principal
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({ 
        name: profileData.name,
        email: profileData.email,
        has_completed_onboarding: true,
        onboarding_data: profileData.onboarding_data
      })
      .eq('id', userId)
      .select();
    
    if (profileError) throw profileError;
    
    // 2. Inserir ou atualizar atributos do usuário
    const attributes = {
      vitality: 50,
      energy: 60,
      focus: 40,
      mood: 55
    };
    
    // Verificar se o usuário já tem atributos
    const { data: existingAttributes } = await supabase
      .from('user_attributes')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (existingAttributes) {
      // Atualizar atributos existentes
      const { error: attributesError } = await supabase
        .from('user_attributes')
        .update(attributes)
        .eq('user_id', userId);
      
      if (attributesError) throw attributesError;
    } else {
      // Criar novos atributos
      const { error: attributesError } = await supabase
        .from('user_attributes')
        .insert([{ user_id: userId, ...attributes }]);
      
      if (attributesError) throw attributesError;
    }
    
    // 3. Inserir dados de onboarding detalhados
    const { error: onboardingError } = await supabase
      .from('onboarding_data')
      .upsert([{
        user_id: userId,
        age: parseInt(profileData.onboarding_data.age) || null,
        gender: profileData.onboarding_data.gender,
        height: parseFloat(profileData.onboarding_data.physical?.height) || null,
        weight: parseFloat(profileData.onboarding_data.physical?.weight) || null,
        activity_level: profileData.onboarding_data.physical?.activity_level,
        sleep_quality: profileData.onboarding_data.physical?.sleep_quality || null,
        diet_quality: profileData.onboarding_data.physical?.diet_quality || null,
        fitness_goal: profileData.onboarding_data.physical?.fitness_goal,
        health_issues: profileData.onboarding_data.physical?.health_issues,
        stress_level: profileData.onboarding_data.mental?.stress_level || null,
        mental_health: profileData.onboarding_data.mental?.mental_health || null,
        focus_ability: profileData.onboarding_data.mental?.focus_ability || null,
        meditation_experience: profileData.onboarding_data.mental?.meditation_experience,
        education_level: profileData.onboarding_data.intellectual?.education_level,
        learning_interests: profileData.onboarding_data.intellectual?.learning_interests,
        reading_frequency: profileData.onboarding_data.intellectual?.reading_frequency,
        intellectual_level: profileData.onboarding_data.intellectual?.intellectual_level || null,
        emotional_awareness: profileData.onboarding_data.emotional?.emotional_awareness || null,
        emotional_regulation: profileData.onboarding_data.emotional?.emotional_regulation || null,
        life_balance: profileData.onboarding_data.emotional?.life_balance || null,
        relationship_status: profileData.onboarding_data.emotional?.relationship_status,
        social_circle_size: profileData.onboarding_data.social?.social_circle_size,
        social_satisfaction: profileData.onboarding_data.social?.social_satisfaction || null,
        communication_skills: profileData.onboarding_data.social?.communication_skills || null,
        networking_ability: profileData.onboarding_data.social?.networking_ability || null,
        income_range: profileData.onboarding_data.financial?.income_range,
        savings_habit: profileData.onboarding_data.financial?.savings_habit || null,
        financial_literacy: profileData.onboarding_data.financial?.financial_literacy || null,
        financial_goal: profileData.onboarding_data.financial?.financial_goal,
        debt_level: profileData.onboarding_data.financial?.debt_level
      }], { onConflict: 'user_id' });
    
    if (onboardingError) throw onboardingError;
    
    return { data: updatedProfile, error: null };
  } catch (error) {
    console.error('Erro ao completar onboarding:', error);
    return { data: null, error };
  }
};

// Função para usar quando o procedimento armazenado não estiver disponível
export const addUserRewards = async (userId: string, xpReward: number, currencyReward: number) => {
  try {
    // Primeiro, obter o perfil atual do usuário
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('level, experience, currency')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    if (!profile) throw new Error('Perfil não encontrado');
    
    // Calcular nova experiência e nível
    let newExperience = profile.experience + xpReward;
    let newLevel = profile.level;
    
    // Verificar se o usuário subiu de nível (sistema simples: 100xp por nível)
    const xpPerLevel = 100;
    if (newExperience >= xpPerLevel) {
      newLevel += Math.floor(newExperience / xpPerLevel);
      newExperience = newExperience % xpPerLevel;
    }
    
    // Calcular nova quantidade de moedas
    const newCurrency = profile.currency + currencyReward;
    
    // Atualizar o perfil
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        level: newLevel,
        experience: newExperience,
        currency: newCurrency
      })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    return {
      success: true,
      newLevel,
      newExperience,
      newCurrency,
      levelUp: newLevel > profile.level
    };
  } catch (error) {
    console.error('Erro ao adicionar recompensas:', error);
    return { success: false, error };
  }
};

// Função para obter as tarefas do usuário formatadas para o tipo Task
export const getUserTasks = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    return { data: null, error };
  }
};

// Função para criar uma nova tarefa para o usuário
export const createUserTask = async (
  userId: string, 
  taskData: { 
    title: string; 
    description: string; 
    xpReward: number; 
    statBoosts?: any;
    recurring?: boolean;
    recurringType?: string; 
    dueDate?: string; 
  }
) => {
  try {
    // 1. Primeiro criar a tarefa na tabela quests
    const { data: quest, error: questError } = await supabase
      .from('quests')
      .insert([{
        title: taskData.title,
        description: taskData.description,
        xp_reward: taskData.xpReward,
        stat_boosts: taskData.statBoosts || {},
        recurring: taskData.recurring || false,
        recurring_type: taskData.recurringType || null,
        is_global: false,
        created_at: new Date().toISOString()
      }])
      .select();

    if (questError) throw questError;
    if (!quest || quest.length === 0) throw new Error('Falha ao criar quest');

    const questId = quest[0].id;

    // 2. Associar a quest ao usuário
    const { data: userQuest, error: userQuestError } = await supabase
      .from('user_quests')
      .insert([{
        user_id: userId,
        quest_id: questId,
        status: 'active',
        progress: 0,
        created_at: new Date().toISOString(),
        due_date: taskData.dueDate || null
      }])
      .select();

    if (userQuestError) throw userQuestError;

    // 3. Retornar a tarefa no formato esperado pela aplicação
    return {
      data: {
        id: userQuest?.[0]?.id,
        title: taskData.title,
        description: taskData.description,
        xpReward: taskData.xpReward,
        completed: false,
        recurring: taskData.recurring || false,
        recurringType: taskData.recurringType,
        dueDate: taskData.dueDate,
        createdAt: new Date().toISOString(),
        completedAt: null,
        statBoosts: taskData.statBoosts || {}
      },
      error: null
    };
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return { data: null, error };
  }
}; 