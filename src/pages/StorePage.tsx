import React, { useState, useEffect } from 'react';
import StorePanel from '../components/StorePanel';
import NeuroscienceWidget from '../components/NeuroscienceWidget';
import { UserData } from '../types/gameTypes';
import { useAuth } from '../context/AuthContext';
import { getStoreItems, purchaseItem } from '../lib/supabase';

const StorePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [userData, setUserData] = useState<Partial<UserData>>({
    currency: 0,
    inventory: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeItems, setStoreItems] = useState<any[]>([]);
  
  useEffect(() => {
    const loadStoreData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Carregar dados do usuário do contexto
        setUserData({
          id: user.id,
          name: profile?.name || user.email?.split('@')[0] || 'Caçador Solo',
          level: profile?.level || 1,
          experience: profile?.experience || 0,
          currency: profile?.currency || 0,
          inventory: [] // Idealmente carregaríamos o inventário do usuário aqui
        });
        
        // Carregar itens da loja
        const { data, error } = await getStoreItems();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setStoreItems(data);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da loja:', err);
        setError('Não foi possível carregar os itens da loja. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    loadStoreData();
  }, [user, profile]);
  
  // Função para comprar um item
  const handlePurchase = async (itemId: string, price: number) => {
    if (!user) return;
    
    // Verificar se o usuário tem moedas suficientes
    if ((userData.currency || 0) < price) {
      alert('Você não tem moedas suficientes para comprar este item.');
      return;
    }
    
    try {
      const { success, error } = await purchaseItem(user.id, itemId);
      
      if (error) {
        throw error;
      }
      
      if (success) {
        // Atualizar o saldo de moedas localmente
        setUserData(prev => ({
          ...prev,
          currency: (prev.currency || 0) - price
        }));
        
        alert('Item comprado com sucesso!');
      }
    } catch (err) {
      console.error('Erro ao comprar item:', err);
      alert('Ocorreu um erro ao comprar o item. Tente novamente.');
    }
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
      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Loja</h2>
          <div className="flex items-center text-yellow-400">
            <span className="font-medium">{userData.currency}</span>
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-gray-400 mb-6 text-sm">
          Adquira itens e recompensas para melhorar seus atributos e evoluir mais rapidamente.
        </p>
        
        {error ? (
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
          <StorePanel 
            userData={userData as UserData} 
            setUserData={setUserData as React.Dispatch<React.SetStateAction<UserData>>}
            storeItems={storeItems}
            onPurchase={handlePurchase}
          />
        )}
      </div>

      <div className="bg-card/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
        <NeuroscienceWidget 
          title="Sistema de Recompensas" 
          content="Recompensas tangíveis ajudam a reforçar comportamentos positivos através da ativação controlada do circuito de recompensa cerebral, criando associações positivas com hábitos produtivos." 
        />
      </div>
    </div>
  );
};

export default StorePage; 