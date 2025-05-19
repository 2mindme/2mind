import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserData, Item } from '../types/gameTypes';
import NeuroscienceWidget from './NeuroscienceWidget';
import { createPortal } from 'react-dom';

interface StorePanelProps {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  storeItems?: any[]; // Itens da loja recebidos do backend
  onPurchase?: (itemId: string, price: number) => Promise<void>;
}

// Componente de modal para item da loja
const ItemModal: React.FC<{
  item: Item | null;
  onClose: () => void;
  onPurchase: (item: Item) => void;
  userData: UserData;
  purchaseSuccess: boolean;
}> = ({ item, onClose, onPurchase, userData, purchaseSuccess }) => {
  if (!item) return null;

  // Tradução dos tipos
  const typeTranslation = {
    'Consumable': 'Consumível',
    'Equipment': 'Equipamento',
    'Cosmetic': 'Cosmético',
    'RealReward': 'Recompensa Real'
  };

  const modalContent = (
    <>
      {/* Overlay para escurecer o fundo */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 9998
        }}
        onClick={() => !purchaseSuccess && onClose()}
      />
      
      {/* Modal centralizado */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          backgroundColor: '#1f2937', // cor do bg-gray-800
          borderRadius: '0.75rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          border: '1px solid #374151', // cor do border-gray-700
          padding: '1.25rem',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {purchaseSuccess ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-green-400 mb-4">Compra Realizada!</h2>
            <div className="text-8xl mb-6">✅</div>
            <p className="text-gray-300">
              {item.type === 'RealReward' 
                ? 'Sua recompensa será enviada para seu email em instantes!' 
                : 'Item adicionado ao seu inventário!'}
            </p>
            
            {/* Feedback neurológico - importante para o condicionamento */}
            <div className="mt-6 text-xs text-purple-300 text-center">
              <p>Seu cérebro acabou de liberar dopamina, reforçando o comportamento positivo que levou a esta recompensa!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-start">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-purple-300">{item.name}</h3>
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">
                    {typeTranslation[item.type]}
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-3">{item.description}</p>
              
              {/* Efeitos do item */}
              {item.effects.length > 0 && (
                <div className="bg-gray-700 rounded-lg p-3 mb-3">
                  <h4 className="text-sm font-bold text-purple-300 mb-2">Efeitos</h4>
                  <div className="space-y-2">
                    {item.effects.map(effect => (
                      <div key={effect.id} className="flex items-start">
                        <span className="text-xl mr-2">{effect.icon}</span>
                        <div>
                          <p className="text-sm font-medium">{effect.name}</p>
                          <div className="flex text-xs">
                            <span className={effect.modifier > 0 ? 'text-green-400' : 'text-red-400'}>
                              {effect.modifier > 0 ? '+' : ''}{effect.modifier} {effect.affects}
                            </span>
                            <span className="text-gray-400 ml-2">
                              {effect.duration && `(${Math.floor(effect.duration / 3600)}h)`}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Detalhes adicionais */}
              {(item.cooldown || item.duration) && (
                <div className="flex justify-between mb-4 text-xs text-gray-400">
                  {item.duration && (
                    <div>
                      <span className="font-bold">Duração:</span> {Math.floor(item.duration / 3600)}h
                    </div>
                  )}
                  {item.cooldown && (
                    <div>
                      <span className="font-bold">Recarga:</span> {Math.floor(item.cooldown / 3600)}h
                    </div>
                  )}
                </div>
              )}
              
              <div className="mb-6">
                <NeuroscienceWidget 
                  title="Impacto Neurocognitivo" 
                  content={item.neuroscience}
                  showInitially={true}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-yellow-400 font-bold text-lg mr-1">{item.price}</span>
                  <span className="text-yellow-400">Cristais</span>
                </div>
                
                <button
                  className={`px-4 py-2 rounded-lg font-medium ${
                    userData.currency >= item.price 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => userData.currency >= item.price && onPurchase(item)}
                >
                  {userData.currency >= item.price ? 'Comprar' : 'Cristais Insuficientes'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

const StorePanel: React.FC<StorePanelProps> = ({ userData, setUserData, storeItems = [], onPurchase }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Consumable' | 'Equipment' | 'Cosmetic' | 'RealReward'>('all');
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Fallback para itens de exemplo caso o backend não forneça itens
  const defaultStoreItems: Item[] = [
    {
      id: 'item1',
      name: 'Poção de Foco',
      description: 'Aumenta temporariamente sua capacidade de concentração e produtividade por 2 horas',
      icon: '🧪',
      price: 30,
      type: 'Consumable',
      effects: [
        {
          id: 'effect1',
          name: 'Foco Intensificado',
          description: 'Aumento temporário de foco',
          icon: '🎯',
          duration: 7200, // 2 horas
          affects: 'focus',
          modifier: 15,
          source: 'Poção de Foco',
          neuroscience: 'Simula o efeito de atividade dopaminérgica sustentada no córtex pré-frontal, aumentando a eficiência das redes de atenção e modulando sistema noradrenérgico.'
        }
      ],
      duration: 7200,
      cooldown: 10800, // 3 horas
      neuroscience: 'Reforça a associação entre comportamento desejado (trabalho focado) e sistema de recompensa, criando um ciclo de feedback positivo. A duração limitada evita habituação dopaminérgica e dependência.'
    },
    {
      id: 'item2',
      name: 'Escudo Anti-Distrações',
      description: 'Reduz o impacto de notificações e interrupções externas por 4 horas',
      icon: '🛡️',
      price: 50,
      type: 'Equipment',
      effects: [
        {
          id: 'effect2',
          name: 'Barreira Cognitiva',
          description: 'Resistência a distrações externas',
          icon: '🔇',
          duration: 14400, // 4 horas
          affects: 'focus',
          modifier: 10,
          source: 'Escudo Anti-Distrações',
          neuroscience: 'Fortalece circuitos de inibição no córtex pré-frontal, aumentando resistência a estímulos sensoriais irrelevantes e reduzindo interrupções no fluxo de trabalho.'
        }
      ],
      duration: 14400,
      neuroscience: 'Otimiza o funcionamento do filtro de atenção talâmico (TRN) e córtex pré-frontal, reduzindo a interferência sensorial de baixa prioridade no processamento cognitivo ativo.'
    },
    {
      id: 'item3',
      name: 'Voucher Netflix',
      description: 'Um mês grátis de Netflix como recompensa por seu progresso consistente',
      icon: '🎬',
      price: 300,
      type: 'RealReward',
      effects: [
        {
          id: 'effect3',
          name: 'Satisfação de Recompensa',
          description: 'Aumento de bem-estar e motivação',
          icon: '😊',
          duration: 86400, // 24 horas
          affects: 'mood',
          modifier: 20,
          source: 'Recompensa Real',
          neuroscience: 'Ativa fortemente o sistema de recompensa mesolímbico, com liberação sustentada de dopamina no nucleus accumbens, criando associação positiva com o sistema de gamificação.'
        }
      ],
      neuroscience: 'Recompensas reais tangíveis criam uma ponte entre comportamentos virtuais e consequências físicas, reforçando que as ações no aplicativo têm impacto real na vida, intensificando a motivação intrínseca.'
    },
    {
      id: 'item4',
      name: 'Restauração Completa',
      description: 'Restaura todos os seus atributos para 100% instantaneamente',
      icon: '✨',
      price: 150,
      type: 'Consumable',
      effects: [
        {
          id: 'effect4',
          name: 'Restauração Total',
          description: 'Todos atributos restaurados',
          icon: '⚡',
          duration: 3600, // 1 hora
          affects: 'vitality',
          modifier: 100,
          source: 'Restauração Completa',
          neuroscience: 'Simula o efeito de reset no sistema nervoso autônomo, com redução do cortisol e adrenalina, normalização da variabilidade cardíaca e restauração do equilíbrio neuroquímico basal.'
        }
      ],
      cooldown: 86400, // 24 horas
      neuroscience: 'Proporciona sensação de renovação neurológica completa, associada à percepção de controle sobre estados corporais e cognitivos, potencializando resiliência ao estresse e eficiência cognitiva subsequente.'
    },
    {
      id: 'item5',
      name: 'Aura de Produtividade',
      description: 'Skin visual que envolve seu avatar com uma aura dourada',
      icon: '👤✨',
      price: 100,
      type: 'Cosmetic',
      effects: [],
      neuroscience: 'Estimula sistema de recompensa através de sinalização social visual de status, ativando áreas cerebrais relacionadas à auto-imagem e percepção de identidade, reforçando auto-conceito positivo associado à produtividade.'
    },
  ];
  
  // Usar os itens do backend se disponíveis, ou os itens de exemplo caso contrário
  const displayItems = storeItems.length > 0 
    ? storeItems.map(item => ({
        ...item,
        effects: item.effects || []
      })) as Item[]
    : defaultStoreItems;
  
  // Filtrar itens por categoria
  const filteredItems = selectedCategory === 'all' 
    ? displayItems 
    : displayItems.filter(item => item.type === selectedCategory);

  const purchaseItem = (item: Item) => {
    // Verificar se temos saldo suficiente
    if (userData.currency < item.price) {
      alert('Você não tem Cristais suficientes para comprar este item.');
      return;
    }

    // Se onPurchase foi fornecido como prop, usá-lo
    if (onPurchase) {
      onPurchase(item.id, item.price)
        .then(() => {
          setPurchaseSuccess(true);
          setTimeout(() => {
            setPurchaseSuccess(false);
            setSelectedItem(null);
          }, 3000);
        })
        .catch(error => {
          console.error('Erro ao comprar item:', error);
          alert('Não foi possível processar sua compra. Tente novamente.');
        });
      return;
    }

    // Lógica local (fallback) caso onPurchase não seja fornecido
    // Atualizar o saldo de moedas
      setUserData(prev => ({
        ...prev,
        currency: prev.currency - item.price,
        inventory: [...prev.inventory, item]
      }));
      
    // Mostrar a mensagem de sucesso
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedItem(null);
    }, 3000);
  };

  return (
    <>
      {/* Categorias */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <div className="inline-flex space-x-2">
        <button 
            className={`px-3 py-1.5 rounded-full text-sm ${
              selectedCategory === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          onClick={() => setSelectedCategory('all')}
        >
          Todos
        </button>
        <button 
            className={`px-3 py-1.5 rounded-full text-sm ${
              selectedCategory === 'Consumable' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          onClick={() => setSelectedCategory('Consumable')}
        >
          Consumíveis
        </button>
        <button 
            className={`px-3 py-1.5 rounded-full text-sm ${
              selectedCategory === 'Equipment' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          onClick={() => setSelectedCategory('Equipment')}
        >
          Equipamentos
        </button>
        <button 
            className={`px-3 py-1.5 rounded-full text-sm ${
              selectedCategory === 'RealReward' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          onClick={() => setSelectedCategory('RealReward')}
        >
          Recompensas Reais
        </button>
        </div>
      </div>
      
      {/* Grid de itens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            className="bg-card-dark/70 hover:bg-card-dark rounded-xl p-4 cursor-pointer border border-gray-800 hover:border-purple-600/30 transition-all duration-300"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => setSelectedItem(item)}
          >
            <div className="flex items-center mb-3">
              <span className="text-3xl mr-3">{item.icon}</span>
              <h3 className="font-medium text-gray-200">{item.name}</h3>
            </div>
            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-yellow-400">
                <span className="font-bold">{item.price}</span>
                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                {item.type === 'Consumable' && 'Consumível'}
                {item.type === 'Equipment' && 'Equipamento'}
                {item.type === 'Cosmetic' && 'Cosmético'}
                {item.type === 'RealReward' && 'Recompensa Real'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onPurchase={purchaseItem}
          userData={userData}
          purchaseSuccess={purchaseSuccess}
        />
      )}
    </>
  );
};

export default StorePanel; 