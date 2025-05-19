import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { RoutineItem, ScheduledRoutineItem } from '../types';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../pages/calendar-custom.css";

const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const RoutinePage: React.FC = () => {
  const { profile, loading } = useAuth();
  
  // Adiciona useEffect para logar acesso do usuário
  useEffect(() => {
    if (profile) {
      console.log(`Usuário acessou a página de rotina: ${profile.email}`);
    }
  }, [profile]);

  // Estado para os itens de rotina que podem ser arrastados
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([
    {
      id: 'treino',
      title: 'Treino',
      description: 'Exercícios físicos',
      icon: '💪',
      category: 'saude',
      durationMinutes: 60,
      color: '#4CAF50',
      statBoosts: { strength: 2, discipline: 1 }
    },
    {
      id: 'meditacao',
      title: 'Meditação',
      description: 'Prática de mindfulness',
      icon: '🧘',
      category: 'saude',
      durationMinutes: 20,
      color: '#9C27B0',
      statBoosts: { resilience: 2, discipline: 1 }
    },
    {
      id: 'leitura',
      title: 'Leitura',
      description: 'Leitura de livros',
      icon: '📚',
      category: 'estudo',
      durationMinutes: 30,
      color: '#2196F3',
      statBoosts: { intellect: 2, creativity: 1 }
    },
    {
      id: 'cafe',
      title: 'Café da Manhã',
      description: 'Refeição matinal',
      icon: '🍳',
      category: 'saude',
      durationMinutes: 30,
      color: '#FF9800',
      statBoosts: { strength: 1 }
    },
    {
      id: 'trabalho',
      title: 'Trabalho',
      description: 'Atividades profissionais',
      icon: '💼',
      category: 'trabalho',
      durationMinutes: 120,
      color: '#795548',
      statBoosts: { discipline: 1, intellect: 1 }
    },
    {
      id: 'almoco',
      title: 'Almoço',
      description: 'Refeição do meio-dia',
      icon: '🍽️',
      category: 'saude',
      durationMinutes: 60,
      color: '#FF5722',
      statBoosts: { strength: 1 }
    },
    {
      id: 'social',
      title: 'Encontro com amigos',
      description: 'Tempo de socialização',
      icon: '👥',
      category: 'social',
      durationMinutes: 120,
      color: '#E91E63',
      statBoosts: { creativity: 1, resilience: 1 }
    },
  ]);

  // Estado para a programação de atividades (horários preenchidos)
  const [schedule, setSchedule] = useState<{[key: string]: ScheduledRoutineItem[]}>({});
  
  // Estado para o formulário de nova atividade
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<RoutineItem>>({
    title: '',
    description: '',
    icon: '⭐',
    category: 'outro',
    durationMinutes: 30,
    color: '#3F51B5',
  });

  // Estado para tarefas concluídas
  const [completedTasks, setCompletedTasks] = useState<{[key: string]: boolean}>({});

  // Estado para filtro de horário de acordar/dormir
  const [wakeupHour, setWakeupHour] = useState(6); // 06:00
  const [sleepHour, setSleepHour] = useState(22); // 22:00
  const [showAllHours, setShowAllHours] = useState(false);
  
  // Gerar horários para o dia (de 0 a 23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Filtrar horários com base no filtro de acordar/dormir
  const filteredHours = showAllHours 
    ? hours 
    : hours.filter(hour => hour >= wakeupHour && hour < sleepHour);

  // Lista de ícones para escolher
  const iconOptions = ['⭐', '🏃', '💪', '🧘', '📚', '🍳', '💼', '🍽️', '👥', '🎮', '🎨', '🎵', '💤', '🧠', '🛌', '☕'];
  
  // Lista de categorias
  const categoryOptions = [
    { value: 'saude', label: 'Saúde' },
    { value: 'trabalho', label: 'Trabalho' },
    { value: 'lazer', label: 'Lazer' },
    { value: 'estudo', label: 'Estudo' },
    { value: 'social', label: 'Social' },
    { value: 'outro', label: 'Outro' },
  ];

  // Adicionar estado para recomendação
  const [recommendation, setRecommendation] = useState<null | {
    hour: number;
    activity: RoutineItem;
  }>(null);

  // Definir atividade "Banho" (caso não exista)
  const banhoActivity: RoutineItem = {
    id: 'banho',
    title: 'Banho',
    description: 'Higiene após o treino',
    icon: '🚿',
    category: 'saude',
    durationMinutes: 20,
    color: '#00BCD4',
    statBoosts: { resilience: 1 }
  };

  // Função para lidar com arrasto de itens
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: RoutineItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };
  
  // Função para permitir soltar
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  // Função para verificar se uma atividade cabe no horário específico
  const activityFitsInHour = (hour: number, durationMinutes: number) => {
    const existingActivities = schedule[hour] || [];
    const totalMinutesUsed = existingActivities.reduce((total, activity) => {
      return total + activity.durationMinutes;
    }, 0);
    
    return totalMinutesUsed + durationMinutes <= 60;
  };

  // Função para sugerir atividade após adicionar outra
  const suggestActivity = (addedItem: RoutineItem, hour: number) => {
    // Exemplo: se for treino, sugerir banho no próximo horário disponível
    if (addedItem.id === 'treino') {
      const nextHour = hour + Math.ceil(addedItem.durationMinutes / 60);
      // Verifica se o próximo horário existe e tem espaço
      if (
        nextHour < 24 &&
        activityFitsInHour(nextHour, banhoActivity.durationMinutes) &&
        !(schedule[nextHour]?.some(a => a.id === 'banho'))
      ) {
        setRecommendation({ hour: nextHour, activity: banhoActivity });
      }
    }
    // Outras recomendações podem ser adicionadas aqui
  };

  // Função para quando o item é solto em um horário
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, hour: number) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    
    try {
      const item = JSON.parse(itemData) as RoutineItem;
      
      // Verificar se a atividade cabe neste horário
      if (!activityFitsInHour(hour, item.durationMinutes)) {
        alert('Não há tempo suficiente neste horário para esta atividade.');
        return;
      }
      
      // Criar um item programado
      const scheduledItem: ScheduledRoutineItem = {
        ...item,
        startHour: hour,
        endHour: hour + Math.ceil(item.durationMinutes / 60),
        dayOfWeek: new Date().getDay()
      };
      
      // Atualizar o horário
      setSchedule(prevSchedule => {
        const updatedSchedule = { ...prevSchedule };
        updatedSchedule[hour] = [...(updatedSchedule[hour] || []), scheduledItem];
        return updatedSchedule;
      });
      // Chamar sugestão
      suggestActivity(item, hour);
    } catch (error) {
      console.error('Erro ao processar item:', error);
    }
  };
  
  // Função para remover atividade do horário
  const handleRemoveFromSchedule = (hour: number, itemIndex: number) => {
    setSchedule(prevSchedule => {
      const updatedSchedule = { ...prevSchedule };
      if (updatedSchedule[hour]) {
        updatedSchedule[hour] = updatedSchedule[hour].filter((_, index) => index !== itemIndex);
        if (updatedSchedule[hour].length === 0) {
          delete updatedSchedule[hour];
        }
      }
      return updatedSchedule;
    });
  };
  
  // Função para adicionar nova atividade personalizada
  const handleAddNewActivity = () => {
    if (newActivity.title && newActivity.durationMinutes) {
      const newItem: RoutineItem = {
        id: `custom-${Date.now()}`,
        title: newActivity.title,
        description: newActivity.description || `Atividade personalizada`,
        icon: newActivity.icon || '⭐',
        category: newActivity.category as any || 'outro',
        durationMinutes: newActivity.durationMinutes,
        color: newActivity.color || '#3F51B5',
      };
      
      setRoutineItems([...routineItems, newItem]);
      setShowNewActivityForm(false);
      setNewActivity({
        title: '',
        description: '',
        icon: '⭐',
        category: 'outro',
        durationMinutes: 30,
        color: '#3F51B5',
      });
    }
  };

  // Função para adicionar recomendação
  const handleAddRecommendation = () => {
    if (recommendation) {
      const { hour, activity } = recommendation;
      setSchedule(prevSchedule => {
        const updatedSchedule = { ...prevSchedule };
        updatedSchedule[hour] = [...(updatedSchedule[hour] || []), {
          ...activity,
          startHour: hour,
          endHour: hour + Math.ceil(activity.durationMinutes / 60),
          dayOfWeek: new Date().getDay()
        }];
        return updatedSchedule;
      });
      setRecommendation(null);
    }
  };

  // Função para ignorar recomendação
  const handleIgnoreRecommendation = () => {
    setRecommendation(null);
  };

  // Calcular a porcentagem de ocupação de cada hora
  const getHourUsagePercentage = (hour: number) => {
    if (!schedule[hour]) return 0;
    const totalMinutes = schedule[hour].reduce((sum, item) => sum + item.durationMinutes, 0);
    return Math.min(100, Math.round((totalMinutes / 60) * 100));
  };

  // Calcular estatísticas da rotina
  const getRoutineStats = () => {
    let totalTasks = 0;
    let completedTasksCount = 0;
    
    // Contar todas as tarefas na programação
    Object.keys(schedule).forEach(hour => {
      const tasksInHour = schedule[parseInt(hour)];
      totalTasks += tasksInHour.length;
      
      // Contar tarefas concluídas
      tasksInHour.forEach((task, index) => {
        const taskId = `${hour}-${task.id}-${index}`;
        if (completedTasks[taskId]) {
          completedTasksCount++;
        }
      });
    });
    
    return {
      total: totalTasks,
      completed: completedTasksCount,
      percentage: totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0
    };
  };

  const routineStats = getRoutineStats();

  // Função para marcar tarefa como concluída
  const toggleTaskCompletion = (hour: number, index: number) => {
    const task = schedule[hour][index];
    const taskId = `${hour}-${task.id}-${index}`;
    setCompletedTasks(prev => {
      const novo = { ...prev, [taskId]: !prev[taskId] };
      // Se está marcando como concluída
      if (!prev[taskId]) {
        setRoutineXP(xp => xp + XP_ATIVIDADE_ROTINA);
        setXpFeedback(`+${XP_ATIVIDADE_ROTINA} XP!`);
        setTimeout(() => setXpFeedback(null), 2000);
      }
      return novo;
    });
  };

  // XP de rotina
  const [routineXP, setRoutineXP] = useState(0);
  const [xpFeedback, setXpFeedback] = useState<string | null>(null);
  const XP_ATIVIDADE_ROTINA = 1;

  // Converter schedule para eventos do calendário
  const calendarEvents = Object.entries(schedule).flatMap(([hour, items]) =>
    items.map((item) => ({
      title: item.title,
      start: new Date(new Date().setHours(Number(hour), 0, 0, 0)),
      end: new Date(new Date().setHours(Number(hour) + Math.ceil(item.durationMinutes / 60), 0, 0, 0)),
      allDay: false,
      resource: item,
    }))
  );

  // Estado para alternância entre visualização de tabela e calendário
  const [viewMode, setViewMode] = useState<'tabela' | 'calendario'>('tabela');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="h-[calc(100vh-5rem)] flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Feedback visual de XP */}
      {xpFeedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-success/90 text-white px-6 py-2 rounded-xl shadow-lg text-lg font-bold animate-bounce">
          {xpFeedback}
        </div>
      )}
      {/* Barra de XP fixa */}
      <div className="fixed right-8 top-6 z-40 bg-card/80 px-4 py-2 rounded-lg shadow text-info font-bold text-sm">
        XP de Rotina: {routineXP}
      </div>
      {/* Botão de alternância de visualização */}
      <div className="flex justify-end mb-2 gap-2">
        <button onClick={() => setViewMode('tabela')} className={`px-3 py-1 rounded ${viewMode==='tabela' ? 'bg-info text-white' : 'bg-gray-700 text-gray-300'}`}>Tabela</button>
        <button onClick={() => setViewMode('calendario')} className={`px-3 py-1 rounded ${viewMode==='calendario' ? 'bg-info text-white' : 'bg-gray-700 text-gray-300'}`}>Calendário</button>
      </div>
      <div className="flex flex-1 gap-6 p-4 overflow-hidden">
        {/* Visualização de tabela */}
        {viewMode === 'tabela' && (
          <div className="flex-1 min-w-0">
            <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800 h-full flex flex-col">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Minha Rotina Diária</h2>
                  <p className="text-gray-400">Arraste as atividades para criar sua programação personalizada</p>
                </div>
                {routineStats.total > 0 && (
                  <div className="mt-4 md:mt-0 bg-card/40 p-3 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <span className="block text-sm text-gray-400">Concluídas</span>
                        <span className="text-lg font-medium text-white">{routineStats.completed}/{routineStats.total}</span>
                      </div>
                      <div>
                        <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-2 bg-success rounded-full" 
                            style={{ width: `${routineStats.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{routineStats.percentage}% concluída</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* Tabela de horários */}
              <div className="bg-card/50 rounded-lg overflow-hidden flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-300 p-3">Horários do Dia</h3>
                <div className="flex-1 overflow-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="bg-gray-800/50">
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Hora</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Atividades</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-400">Tempo Usado</th>
                        <th className="px-4 py-2 text-right text-sm font-medium text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHours.map((hour) => (
                        <tr key={hour} className="border-t border-gray-800">
                          <td className="px-4 py-3 text-sm text-gray-300 w-24">
                            <div className="flex items-center">
                              <span>{hour.toString().padStart(2, '0')}:00</span>
                              {hour === wakeupHour && <span className="ml-2 text-sm">🌅</span>}
                              {hour === sleepHour && <span className="ml-2 text-sm">🌙</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, hour)}
                              className="min-h-[50px] w-full rounded-lg p-2 relative"
                              style={{
                                backgroundColor: "rgba(30, 30, 30, 0.3)",
                                border: '1px dashed rgba(255,255,255,0.1)'
                              }}
                            >
                              {/* Banner de recomendação dentro da célula do horário sugerido */}
                              {recommendation && recommendation.hour === hour && (
                                <div className="absolute left-0 top-0 w-full h-full flex items-center justify-between gap-2 bg-info/20 backdrop-blur-sm rounded z-10" style={{opacity: 0.85, pointerEvents: 'auto'}}>
                                  <div className="flex items-center gap-3 pl-3">
                                    <span className="text-2xl">{recommendation.activity.icon}</span>
                                    <div>
                                      <div className="text-info font-semibold">Sugestão</div>
                                      <div className="text-white text-sm">Adicionar <b>{recommendation.activity.title}</b>?</div>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 pr-3">
                                    <button onClick={handleAddRecommendation} className="px-2 py-1 bg-success text-white rounded hover:bg-success/80 text-xs">Adicionar</button>
                                    <button onClick={handleIgnoreRecommendation} className="px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600 text-xs">Ignorar</button>
                                  </div>
                                </div>
                              )}
                              {/* Atividades agendadas, uma embaixo da outra */}
                              {schedule[hour] && schedule[hour].length > 0 && (
                                <div className="flex flex-col gap-2">
                                  {schedule[hour].map((item, index) => {
                                    const taskId = `${hour}-${item.id}-${index}`;
                                    const isCompleted = completedTasks[taskId] || false;
                                    return (
                                      <div 
                                        key={`${item.id}-${index}`}
                                        className={`flex items-center p-2 rounded-lg ${isCompleted ? 'opacity-60' : ''}`}
                                        style={{ 
                                          backgroundColor: item.color + '33',
                                          borderLeft: `4px solid ${item.color}`
                                        }}
                                      >
                                        <button
                                          onClick={() => toggleTaskCompletion(hour, index)}
                                          className={`w-5 h-5 min-w-5 mr-2 rounded border flex items-center justify-center ${
                                            isCompleted 
                                              ? 'bg-success border-success text-white' 
                                              : 'border-gray-600 bg-gray-800/50'
                                          }`}
                                        >
                                          {isCompleted && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                          )}
                                        </button>
                                        <span className="text-xl mr-2">{item.icon}</span>
                                        <div className="flex-1">
                                          <h4 className={`text-sm font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-white'}`}>{item.title}</h4>
                                          <p className="text-xs text-gray-400">{item.durationMinutes} min</p>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveFromSchedule(hour, index)}
                                          className="text-red-400 hover:text-red-300 ml-2"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 w-32">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-800 rounded-full h-2.5 mr-2">
                                <div 
                                  className="bg-info h-2.5 rounded-full" 
                                  style={{ width: `${getHourUsagePercentage(hour)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {schedule[hour] ? 
                                  schedule[hour].reduce((sum, item) => sum + item.durationMinutes, 0) : 0}
                                /60 min
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {schedule[hour] && schedule[hour].length > 0 && (
                              <button
                                onClick={() => setSchedule(prev => {
                                  const newSchedule = {...prev};
                                  delete newSchedule[hour];
                                  return newSchedule;
                                })}
                                className="text-red-400 hover:text-red-300"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Visualização de calendário */}
        {viewMode === 'calendario' && (
          <div className="flex-1 min-w-0 bg-card/30 rounded-xl p-4 shadow-lg border border-gray-800 h-full flex flex-col">
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%', minHeight: 400 }}
              messages={{
                next: 'Próx',
                previous: 'Ant',
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                agenda: 'Agenda',
                date: 'Data',
                time: 'Hora',
                event: 'Atividade',
                noEventsInRange: 'Sem atividades',
              }}
              popup
              views={['month', 'week', 'day', 'agenda']}
              eventPropGetter={(event: any) => ({ style: { backgroundColor: event.resource?.color || '#3F51B5', color: '#fff', borderRadius: 8, border: 'none', padding: 6, fontWeight: 500, fontSize: 15, boxShadow: '0 2px 8px #0002' } })}
              dayPropGetter={(date) => {
                const isToday = new Date().toDateString() === date.toDateString();
                return {
                  style: {
                    backgroundColor: isToday ? 'rgba(0, 184, 217, 0.08)' : 'transparent',
                    borderRadius: isToday ? 8 : 0,
                    border: 'none',
                  }
                };
              }}
              components={{
                toolbar: (props) => (
                  <div className="rbc-toolbar flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                    <span className="text-lg font-bold text-info">{props.label}</span>
                    <div className="flex gap-2">
                      <button onClick={() => props.onNavigate('PREV')} className="px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-info/80">◀</button>
                      <button onClick={() => props.onNavigate('TODAY')} className="px-2 py-1 rounded bg-info text-white">Hoje</button>
                      <button onClick={() => props.onNavigate('NEXT')} className="px-2 py-1 rounded bg-gray-700 text-gray-200 hover:bg-info/80">▶</button>
                    </div>
                    <div className="flex gap-2">
                      {Object.keys(props.views).map((view: string) => (
                        <button key={view} onClick={() => props.onView(view as any)} className={`px-2 py-1 rounded ${props.view === view ? 'bg-info text-white' : 'bg-gray-700 text-gray-200 hover:bg-info/80'}`}>{view.charAt(0).toUpperCase() + view.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
          </div>
        )}
        {/* Coluna lateral à direita */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-4">
          {/* Filtro de acordar/dormir compacto */}
          <div className="bg-card/50 p-4 rounded-lg mb-2">
            <h3 className="text-md font-semibold text-gray-300 mb-2">Horário</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Acordar</label>
                <select
                  value={wakeupHour}
                  onChange={(e) => setWakeupHour(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-white focus:border-info focus:outline-none"
                >
                  {hours.map(hour => (
                    <option key={`wake-${hour}`} value={hour}>
                      {hour.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
                <span className="text-xl">🌅</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-gray-400">Dormir</label>
                <select
                  value={sleepHour}
                  onChange={(e) => setSleepHour(Number(e.target.value))}
                  className="bg-gray-900 border border-gray-700 rounded-md px-2 py-1 text-xs text-white focus:border-info focus:outline-none"
                >
                  {hours.map(hour => (
                    <option key={`sleep-${hour}`} value={hour}>
                      {hour.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
                <span className="text-xl">🌙</span>
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="showAllHours"
                  checked={showAllHours}
                  onChange={(e) => setShowAllHours(e.target.checked)}
                  className="h-4 w-4 text-info bg-gray-900 border-gray-700 rounded focus:ring-info"
                />
                <label htmlFor="showAllHours" className="ml-2 text-xs text-gray-400">
                  Mostrar todas as horas
                </label>
              </div>
            </div>
          </div>
          {/* Atividades disponíveis e formulário */}
          <div className="bg-card/50 p-4 rounded-lg flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-300">Atividades Disponíveis</h3>
              <button
                onClick={() => setShowNewActivityForm(!showNewActivityForm)}
                className="px-3 py-1 bg-info/20 text-info text-sm rounded-md hover:bg-info/30 transition-colors"
              >
                {showNewActivityForm ? 'Cancelar' : '+ Nova Atividade'}
              </button>
            </div>
            {/* Formulário para adicionar nova atividade */}
            {showNewActivityForm && (
              <div className="mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Criar Nova Atividade</h4>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Título</label>
                    <input
                      type="text"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-info focus:outline-none"
                      placeholder="Nome da atividade"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Descrição</label>
                    <input
                      type="text"
                      value={newActivity.description}
                      onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-info focus:outline-none"
                      placeholder="Descrição breve"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Duração (minutos)</label>
                    <input
                      type="number"
                      min="5"
                      max="240"
                      value={newActivity.durationMinutes}
                      onChange={(e) => setNewActivity({...newActivity, durationMinutes: parseInt(e.target.value)})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-info focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Categoria</label>
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity({...newActivity, category: e.target.value as any})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-info focus:outline-none"
                    >
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Ícone</label>
                    <div className="grid grid-cols-4 gap-2">
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewActivity({...newActivity, icon})}
                          className={`w-10 h-10 text-xl flex items-center justify-center rounded-md hover:bg-gray-700 ${
                            newActivity.icon === icon ? 'bg-info/20 border border-info' : 'bg-gray-800'
                          }`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Cor</label>
                    <input
                      type="color"
                      value={newActivity.color}
                      onChange={(e) => setNewActivity({...newActivity, color: e.target.value})}
                      className="w-full h-10 rounded-md bg-gray-900 border border-gray-700 cursor-pointer"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddNewActivity}
                  disabled={!newActivity.title || !newActivity.durationMinutes}
                  className="w-full py-2 bg-info text-white rounded-md hover:bg-info/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Atividade
                </button>
              </div>
            )}
            {/* Lista de atividades arrastáveis */}
            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {routineItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="p-3 rounded-lg shadow-md cursor-grab"
                  style={{ 
                    backgroundColor: item.color + '33',
                    borderLeft: `4px solid ${item.color}`
                  }}
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{item.icon}</span>
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.title}</h4>
                      <p className="text-xs text-gray-400">{item.durationMinutes} min</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoutinePage; 