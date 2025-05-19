export interface Attributes {
  vitality: number; // saúde física
  energy: number;   // sono e alimentação
  focus: number;    // produtividade
  mood: number;     // estado emocional
}

export interface StatusEffect {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number; // em segundos
  affects: keyof Attributes;
  modifier: number;
  source: string; // de onde veio o efeito (smartwatch, quest, etc)
  neuroscience: string; // explicação neurocientífica do efeito
}

export enum QuestDifficulty {
  Easy = 'Fácil',
  Medium = 'Médio',
  Hard = 'Difícil',
  Boss = 'Chefe'
}

export interface QuestType {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  currencyReward: number;
  attributeRewards?: Record<string, number>;
  completed: boolean;
  recurring: boolean;
  recurringType?: string;
  createdAt: string;
  dueDate?: string | null;
  completedAt?: string | null;
  isGlobal?: boolean;
}

export enum QuestCategory {
  Physical = 'Físico',     // exercício, alimentação
  Mental = 'Mental',       // estudo, foco, produtividade
  Social = 'Social',       // interações, comunicação
  Personal = 'Pessoal',    // autocuidado, sono
  Professional = 'Profissional' // carreira, trabalho
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  difficulty: QuestDifficulty;
  category: QuestCategory;
  experienceReward: number;
  currencyReward: number;
  buffs?: StatusEffect[];
  completed: boolean;
  dueDate?: Date;
  completionDate?: Date;
  progress?: number; // 0-100 percentual de conclusão
  neuroscience: string; // explicação sobre o benefício comportamental
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  type: 'Consumable' | 'Equipment' | 'Cosmetic' | 'RealReward';
  effects: StatusEffect[];
  duration?: number; // para itens temporários
  cooldown?: number; // tempo para poder usar novamente
  neuroscience: string; // explicação sobre como o item afeta comportamento
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number; // 0-100
  rewards: {
    experience?: number;
    currency?: number;
    items?: Item[];
    statusEffects?: StatusEffect[];
  };
  neuroscience: string; // explicação neurocientífica
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
  unlocked: boolean;
  cost: number;
  requires: string[]; // IDs de habilidades necessárias
  provides: {
    attributeBonus?: Partial<Attributes>;
    statusEffects?: StatusEffect[];
  };
  neuroscience: string; // explicação sobre o benefício neurológico
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
  attributeModifiers: Partial<Attributes>;
  statusEffects: StatusEffect[];
  neuroscience: string; // explicação sobre o papel da persona na identidade
}

export interface UserData {
  id: string;
  name: string;
  level: number;
  experience: number;
  attributes: Attributes;
  activeBuffs: StatusEffect[];
  activeDebuffs: StatusEffect[];
  activePersona: string;
  currency: number;
  completedQuests: QuestType[];
  activeQuests: QuestType[];
  inventory: Item[];
  achievements: Achievement[];
  skillTree?: SkillNode[];
  personas?: Persona[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  level: number;
  experience: number;
  currency: number;
  active_persona?: string;
  has_completed_onboarding: boolean;
  onboarding_data?: any;
  created_at: string;
  updated_at: string;
}

export interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  focusMinutes: number;
  // Outros dados de saúde que podem ser coletados
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  level: number;
  achievements: number; // quantidade de conquistas
  quests: number; // quests completadas
  rank: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Diamante';
  avatar: string;
}

export interface NeuroscienceTip {
  id: string;
  title: string;
  content: string;
  category: 'Dopamina' | 'Hábitos' | 'Foco' | 'Motivação' | 'Sono' | 'Exercício';
  unlockCondition?: string;
  learned: boolean;
} 