import React, { useState, useEffect } from 'react';
import { UserData } from '../types/gameTypes';
import { useAuth } from '../context/AuthContext';
import { getUserAttributes, getPhysicalData, addPhysicalData } from '../lib/supabase';

// Componentes de gráficos seriam importados aqui
// import { Line, Bar } from 'react-chartjs-2';

const PhysicalPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'nutrition' | 'training'>('nutrition');
  const [userData, setUserData] = useState<Partial<UserData>>({
    attributes: {
      vitality: 50,
      energy: 60,
      focus: 40,
      mood: 55
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para dados de nutrição e treino
  const [nutritionData, setNutritionData] = useState([
    { date: '01/06', calories: 2100, protein: 120, carbs: 180, fat: 70 },
    { date: '02/06', calories: 2200, protein: 130, carbs: 190, fat: 65 },
    { date: '03/06', calories: 1900, protein: 110, carbs: 160, fat: 75 },
    { date: '04/06', calories: 2300, protein: 140, carbs: 200, fat: 68 },
    { date: '05/06', calories: 2000, protein: 125, carbs: 170, fat: 72 },
    { date: '06/06', calories: 2150, protein: 135, carbs: 185, fat: 69 },
    { date: '07/06', calories: 2250, protein: 145, carbs: 195, fat: 71 },
  ]);

  // Dados de exemplo para treinos
  const [trainingData, setTrainingData] = useState([
    { date: '01/06', type: 'Força', duration: 60, intensity: 'Alta', muscles: 'Peito, Tríceps' },
    { date: '02/06', type: 'Cardio', duration: 30, intensity: 'Moderada', muscles: 'N/A' },
    { date: '03/06', type: 'Força', duration: 70, intensity: 'Alta', muscles: 'Costas, Bíceps' },
    { date: '04/06', type: 'Descanso', duration: 0, intensity: 'Baixa', muscles: 'N/A' },
    { date: '05/06', type: 'Força', duration: 60, intensity: 'Alta', muscles: 'Pernas' },
    { date: '06/06', type: 'Funcional', duration: 45, intensity: 'Moderada', muscles: 'Full Body' },
    { date: '07/06', type: 'Força', duration: 65, intensity: 'Alta', muscles: 'Ombros, Abdômen' },
  ]);

  // Para estatísticas mostradas no cabeçalho
  const [physicalStats, setPhysicalStats] = useState({
    imc: 22.5,
    dailyCalories: 2150,
    waterIntake: 2.1,
    weeklyWorkouts: 6
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar atributos do usuário
        const { data: attributesData, error: attributesError } = await getUserAttributes(user.id);
        
        if (attributesError) {
          console.error('Erro ao carregar atributos:', attributesError);
        } else if (attributesData) {
          setUserData(prev => ({
            ...prev,
            id: user.id,
            name: profile?.name || user.email?.split('@')[0] || 'Caçador Solo',
            level: profile?.level || 1,
            experience: profile?.experience || 0,
            attributes: {
              vitality: attributesData.vitality || 50,
              energy: attributesData.energy || 60,
              focus: attributesData.focus || 40,
              mood: attributesData.mood || 55
            },
            currency: profile?.currency || 100,
          }));
        }
        
        // Carregar dados físicos do usuário
        const { data: physicalData, error: physicalError } = await getPhysicalData(user.id);
        
        if (physicalError) {
          console.error('Erro ao carregar dados físicos:', physicalError);
        } else if (physicalData && physicalData.length > 0) {
          // Processar dados físicos aqui, se houver integração com dados reais
          // Por enquanto usamos dados simulados
          
          // Calcular IMC se tivermos altura e peso
          if (profile?.onboarding_data?.physical) {
            const height = profile.onboarding_data.physical.height / 100; // cm para metros
            const weight = profile.onboarding_data.physical.weight;
            
            if (height && weight) {
              const imc = weight / (height * height);
              setPhysicalStats(prev => ({
                ...prev,
                imc: parseFloat(imc.toFixed(1))
              }));
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Ocorreu um erro ao carregar seus dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [user, profile]);

  // Função para adicionar nova refeição
  const handleAddMeal = () => {
    // Implementar lógica para abrir modal/formulário para adicionar refeição
    alert('Funcionalidade de adicionar refeição será implementada em breve!');
  };

  // Função para adicionar novo treino
  const handleAddWorkout = () => {
    // Implementar lógica para abrir modal/formulário para adicionar treino
    alert('Funcionalidade de adicionar treino será implementada em breve!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-info"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho com estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">IMC</h3>
          <p className="text-2xl font-bold text-white">{physicalStats.imc}</p>
          <div className="flex items-center text-success text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
            <span>{physicalStats.imc < 18.5 ? 'Abaixo do peso' : 
                  physicalStats.imc < 25 ? 'Normal' : 
                  physicalStats.imc < 30 ? 'Sobrepeso' : 'Obesidade'}</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Calorias Diárias</h3>
          <p className="text-2xl font-bold text-white">{physicalStats.dailyCalories} kcal</p>
          <div className="flex items-center text-info text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Manutenção</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Água</h3>
          <p className="text-2xl font-bold text-white">{physicalStats.waterIntake} L</p>
          <div className="flex items-center text-warning text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <span>Abaixo da meta</span>
          </div>
        </div>
        
        <div className="bg-card/30 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
          <h3 className="text-xs font-medium text-gray-400 mb-1">Treinos Semanais</h3>
          <p className="text-2xl font-bold text-white">{physicalStats.weeklyWorkouts}/7</p>
          <div className="flex items-center text-success text-xs mt-1">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Acima da meta</span>
          </div>
        </div>
      </div>

      {/* Tabs para Nutrição e Treino */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-800">
        <div className="flex border-b border-gray-800">
          <button
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === 'nutrition'
                ? 'text-white border-b-2 border-info'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrição
          </button>
          <button
            className={`flex-1 py-4 px-6 text-sm font-medium ${
              activeTab === 'training'
                ? 'text-white border-b-2 border-info'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('training')}
          >
            Treino
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'nutrition' ? (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Registro Nutricional</h2>
                <button 
                  onClick={handleAddMeal}
                  className="bg-primary-700 hover:bg-primary-600 text-white text-xs rounded-lg px-4 py-2 transition duration-300"
                >
                  Adicionar Refeição
                </button>
              </div>
              
              {/* Gráfico de Macronutrientes (mock) */}
              <div className="bg-card/50 rounded-lg p-4 mb-6 h-64 flex items-center justify-center border border-gray-800">
                <p className="text-gray-400 text-sm">Gráfico de Macronutrientes</p>
              </div>
              
              {/* Tabela de Refeições */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-card/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 rounded-l-lg">Data</th>
                      <th scope="col" className="px-4 py-3">Calorias</th>
                      <th scope="col" className="px-4 py-3">Proteína (g)</th>
                      <th scope="col" className="px-4 py-3">Carboidratos (g)</th>
                      <th scope="col" className="px-4 py-3 rounded-r-lg">Gordura (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{item.date}</td>
                        <td className="px-4 py-3 text-gray-300">{item.calories}</td>
                        <td className="px-4 py-3 text-gray-300">{item.protein}</td>
                        <td className="px-4 py-3 text-gray-300">{item.carbs}</td>
                        <td className="px-4 py-3 text-gray-300">{item.fat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Registro de Treinos</h2>
                <button 
                  onClick={handleAddWorkout}
                  className="bg-primary-700 hover:bg-primary-600 text-white text-xs rounded-lg px-4 py-2 transition duration-300"
                >
                  Adicionar Treino
                </button>
              </div>
              
              {/* Gráfico de Treinos (mock) */}
              <div className="bg-card/50 rounded-lg p-4 mb-6 h-64 flex items-center justify-center border border-gray-800">
                <p className="text-gray-400 text-sm">Gráfico de Volume de Treino</p>
              </div>
              
              {/* Tabela de Treinos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-card/50">
                    <tr>
                      <th scope="col" className="px-4 py-3 rounded-l-lg">Data</th>
                      <th scope="col" className="px-4 py-3">Tipo</th>
                      <th scope="col" className="px-4 py-3">Duração (min)</th>
                      <th scope="col" className="px-4 py-3">Intensidade</th>
                      <th scope="col" className="px-4 py-3 rounded-r-lg">Músculos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainingData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="px-4 py-3 font-medium text-white">{item.date}</td>
                        <td className="px-4 py-3 text-gray-300">{item.type}</td>
                        <td className="px-4 py-3 text-gray-300">{item.duration}</td>
                        <td className="px-4 py-3 text-gray-300">{item.intensity}</td>
                        <td className="px-4 py-3 text-gray-300">{item.muscles}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Plano de treino semanal */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-800">
        <h2 className="text-xl font-bold text-white mb-4">Plano de Treino Semanal</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
            <div key={index} className={`bg-card/50 rounded-xl p-4 border ${index === 3 ? 'border-gray-600' : 'border-gray-800'}`}>
              <h3 className="text-sm font-medium text-gray-300 mb-2">{day}</h3>
              <div className={`text-xs ${index === 3 ? 'text-gray-500' : 'text-gray-400'}`}>
                {index === 0 && 'Peito e Tríceps'}
                {index === 1 && 'Cardio HIIT'}
                {index === 2 && 'Costas e Bíceps'}
                {index === 3 && 'Descanso'}
                {index === 4 && 'Pernas'}
                {index === 5 && 'Ombros e Abdômen'}
                {index === 6 && 'Funcional'}
              </div>
              <div className={`mt-2 text-xs ${index === 3 ? 'text-gray-500' : 'text-gray-400'}`}>
                {index !== 3 && `60 min`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metas e progresso */}
      <div className="bg-card/30 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Metas Físicas</h2>
          <button className="text-info text-sm hover:underline">Editar Metas</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Peso Corporal</h3>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Atual: 75kg</span>
              <span>Meta: 72kg</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-info h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Faltam 3kg para atingir sua meta</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">% Gordura Corporal</h3>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Atual: 18%</span>
              <span>Meta: 15%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-info h-2 rounded-full" style={{ width: '50%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Faltam 3% para atingir sua meta</p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-300">Consumo de Água</h3>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Atual: 2.1L</span>
              <span>Meta: 3L</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-info h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Faltam 0.9L para atingir sua meta diária</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalPage; 