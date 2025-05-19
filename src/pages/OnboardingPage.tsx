import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { completeOnboarding } from '../lib/supabase';

// Componente para cada passo do formulário
interface StepProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const Step: React.FC<StepProps> = ({ children, title, subtitle }) => {
  return (
    <div className="max-w-3xl w-full mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

// Componente para campos de entrada de texto
interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  className,
  required,
  min,
  max,
  step
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-info">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        className="block w-full px-4 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
      />
    </div>
  );
};

// Componente para seleção com opções
interface SelectFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  className?: string;
  required?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  className,
  required
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-info">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="block w-full px-4 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
      >
        <option value="" disabled>
          Selecione uma opção
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Componente para campo de classificação (slider)
interface RatingFieldProps {
  label: string;
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  description?: string;
}

const RatingField: React.FC<RatingFieldProps> = ({
  label,
  id,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  className,
  description
}) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-300">
          {label}
        </label>
        <span className="text-sm text-info font-semibold">{value}/{max}</span>
      </div>
      {description && <p className="text-xs text-gray-500 mb-2">{description}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-info [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Baixo</span>
        <span>Alto</span>
      </div>
    </div>
  );
};

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Dados pessoais básicos
  const [formData, setFormData] = useState({
    // Dados pessoais
    name: '',
    age: '',
    gender: '',
    email: user?.email || '',
    
    // Dimensão física
    height: '',
    weight: '',
    activityLevel: '',
    sleepQuality: 5,
    dietQuality: 5,
    fitnessGoal: '',
    healthIssues: '',
    
    // Dimensão mental
    stressLevel: 5,
    mentalHealth: 5,
    focusAbility: 5,
    meditationExperience: '',
    
    // Dimensão intelectual
    educationLevel: '',
    learningInterests: '',
    readingFrequency: '',
    intellectualLevel: 5,
    
    // Dimensão emocional
    emotionalAwareness: 5,
    emotionalRegulation: 5,
    lifeBalance: 5,
    relationshipStatus: '',
    
    // Dimensão social
    socialCircleSize: '',
    socialSatisfaction: 5,
    communicationSkills: 5,
    networkingAbility: 5,
    
    // Dimensão financeira
    incomeRange: '',
    savingsHabit: 5,
    financialLiteracy: 5,
    financialGoal: '',
    debtLevel: ''
  });

  // Opções para os selects
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

  const fitnessGoalOptions = [
    { value: 'perder_peso', label: 'Perder peso' },
    { value: 'ganhar_massa', label: 'Ganhar massa muscular' },
    { value: 'manter', label: 'Manter o peso atual' },
    { value: 'saude', label: 'Melhorar a saúde geral' },
    { value: 'resistencia', label: 'Aumentar resistência' },
    { value: 'flexibilidade', label: 'Melhorar flexibilidade' }
  ];

  const meditationOptions = [
    { value: 'nenhuma', label: 'Nenhuma experiência' },
    { value: 'iniciante', label: 'Iniciante (experimentei algumas vezes)' },
    { value: 'intermediario', label: 'Intermediário (prática ocasional)' },
    { value: 'regular', label: 'Regular (prática consistente)' },
    { value: 'avancado', label: 'Avançado (prática diária por anos)' }
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

  const debtOptions = [
    { value: 'nenhuma', label: 'Nenhuma dívida' },
    { value: 'baixa', label: 'Dívida baixa (facilmente gerenciável)' },
    { value: 'moderada', label: 'Dívida moderada (gerenciável mas significativa)' },
    { value: 'alta', label: 'Dívida alta (difícil de gerenciar)' },
    { value: 'muito_alta', label: 'Dívida muito alta (situação crítica)' },
    { value: 'prefiro_nao_dizer', label: 'Prefiro não informar' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      
      // Preparar os dados do perfil para salvar
      const profileData = {
        name: formData.name,
        email: formData.email,
        has_completed_onboarding: true
      };
      
      // Preparar os dados dos atributos
      const attributes = {
        physical: {
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          activity_level: formData.activityLevel,
          sleep_quality: formData.sleepQuality,
          diet_quality: formData.dietQuality,
          fitness_goal: formData.fitnessGoal,
          health_issues: formData.healthIssues
        },
        mental: {
          stress_level: formData.stressLevel,
          mental_health: formData.mentalHealth,
          focus_ability: formData.focusAbility,
          meditation_experience: formData.meditationExperience
        },
        intellectual: {
          education_level: formData.educationLevel,
          learning_interests: formData.learningInterests,
          reading_frequency: formData.readingFrequency,
          intellectual_level: formData.intellectualLevel
        },
        emotional: {
          emotional_awareness: formData.emotionalAwareness,
          emotional_regulation: formData.emotionalRegulation,
          life_balance: formData.lifeBalance,
          relationship_status: formData.relationshipStatus
        },
        social: {
          social_circle_size: formData.socialCircleSize,
          social_satisfaction: formData.socialSatisfaction,
          communication_skills: formData.communicationSkills,
          networking_ability: formData.networkingAbility
        },
        financial: {
          income_range: formData.incomeRange,
          savings_habit: formData.savingsHabit,
          financial_literacy: formData.financialLiteracy,
          financial_goal: formData.financialGoal,
          debt_level: formData.debtLevel
        }
      };
      
      // Atualizar o perfil do usuário
      const { error } = await completeOnboarding(user.id, {
        ...profileData,
        onboarding_data: attributes
      });
      
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local do perfil
      await updateProfile({
        has_completed_onboarding: true,
        name: formData.name
      });
      
      // Redirecionar para o dashboard após salvar
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Ocorreu um erro ao salvar seus dados. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  // Definição dos passos do formulário
  const steps = [
    // Passo 1: Boas-vindas e dados pessoais
    <Step 
      key="step1" 
      title="Bem-vindo ao SoloLevel" 
      subtitle="Vamos começar com algumas informações básicas para personalizar sua experiência"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nome completo"
            id="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Seu nome completo"
            required
            className="md:col-span-2"
          />
          
          <InputField
            label="Idade"
            id="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Sua idade"
            min={18}
            max={100}
            required
          />
          
          <SelectField
            label="Gênero"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            required
          />
          
          <InputField
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu.email@exemplo.com"
            required
            className="md:col-span-2"
          />
        </div>
      </div>
    </Step>,
    
    // Passo 2: Dimensão física
    <Step 
      key="step2" 
      title="Dimensão Física" 
      subtitle="Informações sobre sua saúde e condicionamento físico"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Altura (cm)"
            id="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            placeholder="Ex: 175"
            min={100}
            max={250}
            required
          />
          
          <InputField
            label="Peso (kg)"
            id="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Ex: 70"
            min={30}
            max={250}
            step={0.1}
            required
          />
          
          <SelectField
            label="Nível de Atividade Física"
            id="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            options={activityLevelOptions}
            required
            className="md:col-span-2"
          />
          
          <RatingField
            label="Qualidade do Sono"
            id="sleepQuality"
            value={Number(formData.sleepQuality)}
            onChange={handleChange}
            description="Avalie a qualidade do seu sono nos últimos 30 dias"
            className="md:col-span-2"
          />
          
          <RatingField
            label="Qualidade da Alimentação"
            id="dietQuality"
            value={Number(formData.dietQuality)}
            onChange={handleChange}
            description="Avalie o quão saudável é sua alimentação atual"
            className="md:col-span-2"
          />
          
          <SelectField
            label="Principal Objetivo Físico"
            id="fitnessGoal"
            value={formData.fitnessGoal}
            onChange={handleChange}
            options={fitnessGoalOptions}
            required
            className="md:col-span-2"
          />
          
          <div className="md:col-span-2">
            <label htmlFor="healthIssues" className="block text-sm font-medium text-gray-300 mb-2">
              Condições de Saúde Relevantes
            </label>
            <textarea
              id="healthIssues"
              value={formData.healthIssues}
              onChange={(e) => setFormData(prev => ({ ...prev, healthIssues: e.target.value }))}
              placeholder="Mencione condições de saúde ou restrições relevantes (opcional)"
              className="block w-full px-4 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
              rows={3}
            />
          </div>
        </div>
      </div>
    </Step>,
    
    // Passo 3: Dimensão mental e intelectual
    <Step 
      key="step3" 
      title="Dimensão Mental e Intelectual" 
      subtitle="Informações sobre seu bem-estar mental e atividades intelectuais"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Aspectos Mentais</h3>
        <div className="grid grid-cols-1 gap-6">
          <RatingField
            label="Nível de Estresse"
            id="stressLevel"
            value={Number(formData.stressLevel)}
            onChange={handleChange}
            description="Avalie seu nível médio de estresse no último mês"
          />
          
          <RatingField
            label="Saúde Mental Geral"
            id="mentalHealth"
            value={Number(formData.mentalHealth)}
            onChange={handleChange}
            description="Avalie como você classificaria sua saúde mental atual"
          />
          
          <RatingField
            label="Capacidade de Foco"
            id="focusAbility"
            value={Number(formData.focusAbility)}
            onChange={handleChange}
            description="Avalie sua capacidade de manter foco em tarefas importantes"
          />
          
          <SelectField
            label="Experiência com Meditação"
            id="meditationExperience"
            value={formData.meditationExperience}
            onChange={handleChange}
            options={meditationOptions}
          />
        </div>
      </div>
      
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Aspectos Intelectuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Nível de Educação Formal"
            id="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            options={educationOptions}
            className="md:col-span-2"
          />
          
          <InputField
            label="Áreas de Interesse para Aprendizado"
            id="learningInterests"
            type="text"
            value={formData.learningInterests}
            onChange={handleChange}
            placeholder="Ex: tecnologia, filosofia, arte, etc."
            className="md:col-span-2"
          />
          
          <SelectField
            label="Frequência de Leitura"
            id="readingFrequency"
            value={formData.readingFrequency}
            onChange={handleChange}
            options={readingOptions}
            className="md:col-span-2"
          />
          
          <RatingField
            label="Nível de Desenvolvimento Intelectual"
            id="intellectualLevel"
            value={Number(formData.intellectualLevel)}
            onChange={handleChange}
            description="Como você avalia seu nível de desenvolvimento intelectual atual"
            className="md:col-span-2"
          />
        </div>
      </div>
    </Step>,
    
    // Passo 4: Dimensão emocional e social
    <Step 
      key="step4" 
      title="Dimensão Emocional e Social" 
      subtitle="Informações sobre seu bem-estar emocional e relações sociais"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Aspectos Emocionais</h3>
        <div className="grid grid-cols-1 gap-6">
          <RatingField
            label="Autoconsciência Emocional"
            id="emotionalAwareness"
            value={Number(formData.emotionalAwareness)}
            onChange={handleChange}
            description="Avalie quão bem você reconhece suas próprias emoções"
          />
          
          <RatingField
            label="Regulação Emocional"
            id="emotionalRegulation"
            value={Number(formData.emotionalRegulation)}
            onChange={handleChange}
            description="Avalie sua capacidade de gerenciar suas emoções de forma saudável"
          />
          
          <RatingField
            label="Equilíbrio de Vida"
            id="lifeBalance"
            value={Number(formData.lifeBalance)}
            onChange={handleChange}
            description="Avalie o equilíbrio entre vida pessoal, trabalho e lazer"
          />
          
          <SelectField
            label="Status de Relacionamento"
            id="relationshipStatus"
            value={formData.relationshipStatus}
            onChange={handleChange}
            options={relationshipOptions}
          />
        </div>
      </div>
      
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Aspectos Sociais</h3>
        <div className="grid grid-cols-1 gap-6">
          <SelectField
            label="Tamanho do Círculo Social"
            id="socialCircleSize"
            value={formData.socialCircleSize}
            onChange={handleChange}
            options={socialCircleOptions}
          />
          
          <RatingField
            label="Satisfação com Vida Social"
            id="socialSatisfaction"
            value={Number(formData.socialSatisfaction)}
            onChange={handleChange}
            description="Avalie sua satisfação com sua vida social atual"
          />
          
          <RatingField
            label="Habilidades de Comunicação"
            id="communicationSkills"
            value={Number(formData.communicationSkills)}
            onChange={handleChange}
            description="Avalie suas habilidades de comunicação interpessoal"
          />
          
          <RatingField
            label="Capacidade de Networking"
            id="networkingAbility"
            value={Number(formData.networkingAbility)}
            onChange={handleChange}
            description="Avalie sua capacidade de expandir e manter sua rede de contatos"
          />
        </div>
      </div>
    </Step>,
    
    // Passo 5: Dimensão financeira
    <Step 
      key="step5" 
      title="Dimensão Financeira" 
      subtitle="Informações para acompanhar seu desenvolvimento financeiro"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Faixa de Renda Mensal"
            id="incomeRange"
            value={formData.incomeRange}
            onChange={handleChange}
            options={incomeOptions}
            className="md:col-span-2"
          />
          
          <RatingField
            label="Hábito de Poupar"
            id="savingsHabit"
            value={Number(formData.savingsHabit)}
            onChange={handleChange}
            description="Avalie sua consistência em economizar dinheiro regularmente"
            className="md:col-span-2"
          />
          
          <RatingField
            label="Conhecimento Financeiro"
            id="financialLiteracy"
            value={Number(formData.financialLiteracy)}
            onChange={handleChange}
            description="Avalie seu nível de conhecimento sobre investimentos, orçamento e planejamento financeiro"
            className="md:col-span-2"
          />
          
          <SelectField
            label="Nível de Endividamento"
            id="debtLevel"
            value={formData.debtLevel}
            onChange={handleChange}
            options={debtOptions}
            className="md:col-span-2"
          />
          
          <div className="md:col-span-2">
            <label htmlFor="financialGoal" className="block text-sm font-medium text-gray-300 mb-2">
              Principal Objetivo Financeiro
            </label>
            <textarea
              id="financialGoal"
              value={formData.financialGoal}
              onChange={(e) => setFormData(prev => ({ ...prev, financialGoal: e.target.value }))}
              placeholder="Descreva seu principal objetivo financeiro para os próximos anos"
              className="block w-full px-4 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info/50"
              rows={3}
            />
          </div>
        </div>
      </div>
    </Step>,
    
    // Passo 6: Confirmação
    <Step 
      key="step6" 
      title="Pronto para Começar!" 
      subtitle="Confirme suas informações para iniciar sua jornada no SoloLevel"
    >
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="text-center">
          <div className="w-20 h-20 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Tudo Pronto, {formData.name}!</h3>
          <p className="text-gray-400 mb-6">
            As informações que você forneceu serão usadas para personalizar sua experiência e ajudar você a monitorar seu progresso em todas as dimensões do desenvolvimento pessoal.
          </p>
          <p className="text-gray-300 mb-6">
            Clique em "Iniciar Jornada" para começar a usar o SoloLevel.
          </p>
        </div>
      </div>
    </Step>
  ];

  // Indicadores de progresso dos passos
  const renderStepIndicators = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((_, index) => (
          <div key={index} className="flex items-center">
            <div 
              className={`rounded-full h-3 w-3 flex items-center justify-center ${
                index === currentStep 
                  ? 'bg-info' 
                  : index < currentStep 
                  ? 'bg-info/50' 
                  : 'bg-gray-700'
              }`}
            />
            {index < steps.length - 1 && (
              <div 
                className={`h-0.5 w-10 ${
                  index < currentStep ? 'bg-info/50' : 'bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-background-dark py-12">
      <div className="absolute inset-0 bg-[url('/bg-onboarding.jpg')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-glass-gradient opacity-90 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <form onSubmit={handleSubmit}>
          {renderStepIndicators()}
          
          {steps[currentStep]}
          
          <div className="flex justify-between mt-8 max-w-3xl mx-auto">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-card/50 border border-gray-700 rounded-xl text-gray-300 hover:bg-card/70 transition duration-200"
              >
                Voltar
              </button>
            ) : (
              <div></div> // Espaçador
            )}
            
            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-info text-white rounded-xl hover:bg-info/90 transition duration-200"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-info text-white rounded-xl hover:bg-info/90 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  'Iniciar Jornada'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage; 