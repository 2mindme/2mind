export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  stats: UserStats;
  buffs: Buff[];
  debuffs: Debuff[];
  achievements: Achievement[];
  tasks: Task[];
  createdAt: string;
  created_at?: string;
  name?: string;
  experience?: number;
  currency?: number;
  has_completed_onboarding?: boolean;
}

export interface UserStats {
  strength: number;     // força mental/física
  intellect: number;    // capacidade de aprendizado
  discipline: number;   // consistência nas atividades
  creativity: number;   // capacidade de pensar diferente
  resilience: number;   // capacidade de lidar com problemas
}

export interface Task {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  statBoosts: Partial<UserStats>;
  completed: boolean;
  recurring: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  dueDate?: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Buff {
  id: string;
  name: string;
  description: string;
  icon: string;
  statBoosts: Partial<UserStats>;
  duration: number; // em dias
  startedAt: string;
}

export interface Debuff {
  id: string;
  name: string;
  description: string;
  icon: string;
  statPenalties: Partial<UserStats>;
  duration: number; // em dias
  startedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  xpReward: number;
  requirements: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
} 

// Interfaces para rotinas

export interface RoutineItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'saude' | 'trabalho' | 'lazer' | 'estudo' | 'social' | 'outro';
  durationMinutes: number;
  color: string;
  statBoosts?: Partial<UserStats>;
}

export interface ScheduledRoutineItem extends RoutineItem {
  startHour: number;
  endHour: number;
  dayOfWeek: number; // 0-6 (Domingo-Sábado)
} 